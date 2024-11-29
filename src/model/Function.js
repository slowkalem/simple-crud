const { db } = require("../helper/DBUtil");

const createFunction = async (param, createdBy) => {
  let query =
    " INSERT INTO tb_function " +
    " (function_id, " +
    " function_name, " +
    " created_by, " +
    " created_dt, " +
    " updated_by, " +
    " updated_dt) " +
    " VALUES " +
    " ($1,$2,$3,$4,$5,$6) ";

  let dt = new Date();
  await db.none(query, [
    param.functionId,
    param.name,
    createdBy,
    dt,
    createdBy,
    dt,
  ]);
};

const getFunctionById = async (functionId) => {
  let query =
    " SELECT " +
    '   function_id AS "functionId", ' +
    '   function_name AS "name" ' +
    " FROM tb_function " +
    "   WHERE function_id = $1 ";

  let func = await db.oneOrNone(query, [functionId]);
  return func;
};

const deleteFunctionById = async (functionId) => {
  let query = ` DELETE FROM tb_function WHERE function_id = $1 `;
  await db.none(query, [functionId]);
};

const searchFunction = async (param) => {
  let queryParams = [];

  // query
  let query =
    "SELECT " +
    '  u.function_id AS "functionId", ' +
    '  u.function_name AS "name" ' +
    "FROM tb_function u " +
    "  WHERE 1=1  ";

  //dynamic filter
  let counter = 1;
  if (param.name && param.name != "") {
    query += ` AND LOWER(u.function_name) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.name}%`);
  }

  // dynamic order
  if (param.orderBy && param.orderBy != "") {
    let dir = "asc";
    if (param.dir && (param.dir == "asc" || param.dir == "desc")) {
      dir = param.dir;
    }

    query += ` ORDER BY "${param.orderBy}" ${dir} `;
  } else {
    query += ` ORDER BY u.function_name ASC `;
  }

  let totalRows = await db.query(query, queryParams);

  if (!totalRows.length) {
    return {
      page: param.page,
      perPage: param.perPage,
      totalRows: 0,
      totalPages: 0,
      result: [],
    };
  }

  // limit and paging and such
  if (!param.perPage || param.perPage == "") {
    param.perPage = parseInt(process.env.ROW_PAGE);
  }

  limit = param.perPage;

  let offset = 0;
  if (param.page && param.page != "") {
    offset = limit * (param.page - 1);
  }

  query += ` LIMIT ${limit} OFFSET ${offset} `;
  const result = await db.any(query, queryParams);
  totalRows = totalRows.length;
  let totalPages = Math.ceil(totalRows / param.perPage);

  return {
    page: param.page,
    perPage: param.perPage,
    totalRows,
    totalPages,
    result,
  };
};

const updateFunction = async (param, updatedBy) => {
  let query =
    " UPDATE tb_function SET " +
    "   function_name = $1, " +
    "   updated_by = $2, " +
    "   updated_dt = $3 " +
    " WHERE " +
    "   function_id = $4 ";

  let dt = new Date();
  await db.none(query, [param.name, updatedBy, dt, param.functionId]);
};

module.exports = {
  createFunction,
  getFunctionById,
  deleteFunctionById,
  searchFunction,
  updateFunction,
};
