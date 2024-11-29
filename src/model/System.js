const { db } = require("../helper/DBUtil");
const format = require("pg-format");

/* search */
const searchSystem = async (param) => {
  let queryParams = [];

  // query
  let query =
    `SELECT sys_cat as "sysCat", sys_sub_cat as "sysSubCat", sys_code as "sysCode", value, remark, status ` +
    "FROM tb_system " +
    "WHERE 1=1 ";

  // dynamic condition and parameters
  let counter = 1;
  if (param.sysCat && param.sysCat !== "") {
    queryParams.push(param.sysCat);
    query += `AND sys_cat ILIKE $${counter}`;
    counter++;
  }

  if (param.sysSubCat && param.sysSubCat !== "") {
    queryParams.push(param.sysSubCat);
    query += `AND sys_sub_cat ILIKE $${counter}`;
    counter++;
  }

  if (param.sysCode && param.sysCode !== "") {
    queryParams.push(param.sysCode);
    query += `AND sys_code ILIKE $${counter}`;
    counter++;
  }

  if (param.all && param.all != "") {
    query +=
      ` AND (sys_cat ILIKE $${counter} OR sys_sub_cat ILIKE $${counter} ` +
      `OR sys_code ILIKE $${counter} OR value ILIKE $${counter} OR remark ILIKE $${counter}) `;
    queryParams.push(`%${param.all}%`);
  }

  // dynamic order
  if (param.orderBy && param.orderBy !== "" && param.orderBy !== undefined) {
    let dir = "asc";
    let orderBy;
    if (param.dir && (param.dir === "asc" || param.dir === "desc")) {
      dir = param.dir;
    }
    ["sysCat", "sysSubCat", "sysCode", "remark", "value", "status"].includes(
      param.orderBy
    )
      ? (orderBy = param.orderBy)
      : (orderBy = "sysCat");
    query += ` ORDER BY "${orderBy}" ${dir} `;
  } else {
    query += " ORDER BY sys_cat ASC ";
  }

  const totalRows = await db.query(query, queryParams);

  // limit and paging and such
  if (!param.perPage || param.perPage === "") {
    param.perPage = parseInt(process.env.ROW_PAGE);
  }

  const limit = param.perPage;

  let offset = 0;
  if (param.page && param.page !== "") {
    offset = limit * (param.page - 1);
  }

  query += ` LIMIT ${limit} OFFSET ${offset} `;
  const result = await db.any(query, queryParams);
  const totalPages = Math.ceil(totalRows.length / param.perPage);
  return {
    page: param.page,
    perPage: param.perPage,
    totalRows: totalRows.length,
    totalPages,
    result,
  };
};

const getOneSystem = async (param) => {
  let queryParams = [];
  let query =
    `SELECT sys_cat as "sysCat", sys_sub_cat as "sysSubCat", sys_code as "sysCode", value, remark, status ` +
    ` FROM tb_system` +
    ` WHERE 1=1`;

  let counter = 1;
  if (param.sysCat && param.sysCat !== "") {
    queryParams.push(param.sysCat.toUpperCase());
    query += ` AND sys_cat = $${counter}`;
    counter++;
  }

  if (param.sysSubCat && param.sysSubCat !== "") {
    queryParams.push(param.sysSubCat.toUpperCase());
    query += ` AND sys_sub_cat = $${counter}`;
    counter++;
  }

  if (param.sysCode && param.sysCode !== "") {
    queryParams.push(param.sysCode);
    query += ` AND sys_code = $${counter}`;
    counter++;
  }
  const result = await db.oneOrNone(query, queryParams);
  return result;
};

/* insert */
const insertSystem = async (param, createdBy) => {
  let query =
    " INSERT INTO tb_system " +
    " (sys_cat, sys_sub_cat, sys_code, value, remark, status, created_dt, created_by, updated_dt, updated_by)  " +
    " VALUES " +
    " ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ";

  let dt = new Date();
  await db.any(query, [
    param.sysCat,
    param.sysSubCat,
    param.sysCode,
    param.value,
    param.remark,
    param.status,
    dt,
    createdBy,
    dt,
    createdBy,
  ]);
};

/* update */
const updateSystem = async (param, updatedBy) => {
  const query =
    " UPDATE tb_system SET " +
    " value = $1, " +
    " remark = $2, " +
    " status = $3, " +
    " updated_dt = $4, " +
    " updated_by = $5 " +
    " WHERE " +
    " sys_cat = $6 AND " +
    " sys_sub_cat = $7 AND " +
    " sys_code = $8 ";

  const dt = new Date();
  await db.query(query, [
    param.value,
    param.remark,
    param.status,
    dt,
    updatedBy,
    param.sysCat,
    param.sysSubCat,
    param.sysCode,
  ]);
};

/* delete */
const deleteSystem = async (param) => {
  const formatString =
    " DELETE FROM tb_system " +
    " WHERE (sys_cat, sys_sub_cat, sys_code) IN (%L)";
  const query = format(formatString, param);
  const { rowCount } = await db.result(query, param);
  return rowCount;
};

module.exports = {
  searchSystem,
  getOneSystem,
  insertSystem,
  updateSystem,
  deleteSystem,
};
