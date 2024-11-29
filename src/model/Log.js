const { db } = require("../helper/DBUtil");
const { ConvertDate } = require("../helper/CommonUtil");
const moment = require("moment");

/* search */
const searchLog = async (param) => {
  let queryParams = [];

  // query
  let query =
    `SELECT log_id as "logId", username, action, screen, ` +
    `CASE WHEN created_dt IS NOT NULL THEN TO_CHAR(created_dt, 'DD-MM-YYYY HH12:MI AM') ELSE NULL END AS "createdDate", ` +
    `created_by as "createdBy", ` +
    `CASE WHEN updated_dt IS NOT NULL THEN TO_CHAR(updated_dt, 'DD-MM-YYYY HH12:MI AM') ELSE NULL END AS "updatedDate", ` +
    `updated_by as "updatedBy" ` +
    `FROM tb_audit_log ` +
    `WHERE 1=1 `;

  // dynamic condition and parameters
  let counter = 1;
  if (param.logId && param.logId !== "") {
    queryParams.push(param.logId);
    query += ` AND log_id LIKE $${counter++}`;
  }

  if (param.username && param.username !== "") {
    queryParams.push(`%${param.username}%`);
    query += ` AND username LIKE $${counter++}`;
  }

  if (param.action && param.action !== "") {
    queryParams.push(`%${param.action}%`);
    query += ` AND action LIKE $${counter++}`;
  }

  if (param.screen && param.screen !== "") {
    queryParams.push(`%${param.screen}%`);
    query += ` AND screen LIKE $${counter++}`;
  }

  const dateNow = `${moment(new Date()).format("YYYY-MM-DD")} 23:59:59`;

  if (
    param.createdDateBegin &&
    param.createdDateBegin !== "" &&
    param.createdDateEnd &&
    param.createdDateEnd !== ""
  ) {
    param.createdDateBegin = isNaN(Date.parse(param.createdDateBegin))
      ? "1970-01-01 00:00:00"
      : `${param.createdDateBegin} 00:00:00`;
    param.createdDateBegin = ConvertDate(param.createdDateBegin);

    param.createdDateEnd = isNaN(Date.parse(param.createdDateEnd))
      ? dateNow
      : `${param.createdDateEnd} 23:59:59`;
    param.createdDateEnd = ConvertDate(param.createdDateEnd);

    queryParams.push(param.createdDateBegin, param.createdDateEnd);
    query += ` AND created_dt BETWEEN $${counter++} AND $${counter++}`;
  }

  if (param.createdBy && param.createdBy !== "") {
    queryParams.push(`%${param.createdBy}%`);
    query += ` AND created_by LIKE $${counter++}`;
  }

  if (
    param.updatedDateBegin &&
    param.updatedDateBegin !== "" &&
    param.updatedDateEnd &&
    param.updatedDateEnd !== ""
  ) {
    param.updatedDateBegin = isNaN(Date.parse(param.updatedDateBegin))
      ? "1970-01-01 00:00:00"
      : `${param.updatedDateBegin} 00:00:00`;
    param.updatedDateBegin = ConvertDate(param.updatedDateBegin);

    param.updatedDateEnd = isNaN(Date.parse(param.updatedDateEnd))
      ? dateNow
      : `${param.updatedDateEnd} 23:59:59`;
    param.updatedDateEnd = ConvertDate(param.updatedDateEnd);

    queryParams.push(param.updatedDateBegin, param.updatedDateEnd);
    query += ` AND updated_dt BETWEEN $${counter++} AND $${counter++}`;
  }

  if (param.updatedBy && param.updatedBy !== "") {
    queryParams.push(`%${param.updatedBy}%`);
    query += ` AND updated_by LIKE $${counter++}`;
  }

  // dynamic order
  if (param.orderBy && param.orderBy !== "" && param.orderBy !== undefined) {
    let dir = "asc";
    let orderBy;
    if (param.dir && (param.dir === "asc" || param.dir === "desc")) {
      dir = param.dir;
    }
    [
      "action",
      "screen",
      "username",
      "createdDate",
      "createdBy",
      "updatedDate",
      "updatedBy",
    ].includes(param.orderBy)
      ? (orderBy = param.orderBy)
      : (orderBy = "createdDate");
    query += ` ORDER BY "${orderBy}" ${dir} `;
  } else {
    query += " ORDER BY created_dt DESC ";
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

/* insert */
const insertLog = async (param, createdBy) => {
  let query =
    " INSERT INTO tb_audit_log " +
    " (log_id, username, action, screen, created_dt, created_by, updated_dt, updated_by)  " +
    " VALUES " +
    " ($1, $2, $3, $4, $5, $6, $7, $8) ";

  let dt = new Date();
  await db.any(query, [
    param.logId,
    createdBy,
    param.action,
    param.screen,
    dt,
    createdBy,
    dt,
    createdBy,
  ]);
};

module.exports = {
  searchLog,
  insertLog,
};
