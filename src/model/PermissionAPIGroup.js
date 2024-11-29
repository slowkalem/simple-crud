const { db } = require("../helper/DBUtil");
const format = require("pg-format");

const createPermissionAPIGroup = async (param, createdBy) => {
  let query =
    " INSERT INTO tb_permission_api_group " +
    " (permission_api_group_id, " +
    " group_id, " +
    " permission_api_id, " +
    " created_by, " +
    " created_dt, " +
    " updated_by, " +
    " updated_dt) " +
    " VALUES " +
    " ($1,$2,$3,$4,$5,$6,$7) ";

  let dt = new Date();
  await db.none(query, [
    param.permissionAPIGroupId,
    param.groupId,
    param.permissionAPIId,
    createdBy,
    dt,
    createdBy,
    dt,
  ]);
};

const getPermissionAPIGroupById = async (permissionAPIGroupId) => {
  let query =
    " SELECT " +
    '   pag.permission_api_group_id AS "permissionAPIGroupId", ' +
    '   pag.permission_api_id AS "permissionAPIId", ' +
    '   pa.action AS "action", ' +
    '   pa.http_method AS "HTTPMethod", ' +
    '   pa.api_url_name AS "APIURLName", ' +
    '   f.function_id AS "functionId", ' +
    '   f.function_name AS "functionName", ' +
    '   pag.group_id AS "groupId", ' +
    '   g.group_name AS "groupName" ' +
    " FROM tb_permission_api_group pag " +
    " INNER JOIN tb_permission_api pa ON pa.permission_api_id = pag.permission_api_id " +
    " INNER JOIN tb_group g ON g.group_id = pag.group_id " +
    " INNER JOIN tb_function f ON pa.function_id = f.function_id " +
    "   WHERE pag.permission_api_group_id = $1 ";

  let permissionAPIGroup = await db.oneOrNone(query, [permissionAPIGroupId]);
  return permissionAPIGroup;
};

const deletePermissionAPIGroupById = async (permissionAPIId) => {
  let query = ` DELETE FROM tb_permission_api_group WHERE permission_api_group_id = $1 `;
  await db.none(query, [permissionAPIId]);
};

const searchPermissionAPIGroup = async (param) => {
  let queryParams = [];

  // query
  // let query =
  //   'SELECT '
  // + '  pag.permission_api_group_id AS "permissionAPIGroupId", '
  // + '  pag.permission_api_id AS "permissionAPIId", '
  // + '  pa.action AS "action", '
  // + '  pa.http_method AS "HTTPMethod", '
  // + '  pa.api_url_name AS "APIURLName", '
  // + '  f.function_id AS "functionId", '
  // + '  f.function_name AS "functionName", '
  // + '  pag.group_id AS "groupId", '
  // + '  g.group_name AS "groupName", '
  // + '  CASE WHEN pag.permission_api_group_id IS NOT NULL '
  // + `    THEN 'true' `
  // + `    ELSE 'false' `
  // + '  END AS "hasPermission" '
  // + 'FROM tb_permission_api pa '
  // + 'RIGHT JOIN tb_permission_api_group pag ON pa.permission_api_id = pag.permission_api_id '
  // + 'INNER JOIN tb_group g ON g.group_id = pag.group_id '
  // + 'INNER JOIN tb_function f ON pa.function_id = f.function_id '
  // + '  WHERE 1=1 AND pa.status = $1 '
  let query =
    "SELECT " +
    '  pag.permission_api_group_id AS "permissionAPIGroupId", ' +
    '  pa.permission_api_id AS "permissionAPIId", ' +
    '  f.function_id AS "functionId", ' +
    '  f.function_name AS "functionName", ' +
    '  pa.action AS "action", ' +
    '  pa.http_method AS "HTTPMethod", ' +
    '  pa.api_url_name AS "APIURLName", ' +
    "  CASE " +
    `  WHEN pag.permission_api_group_id IS NOT NULL THEN 'true' ` +
    `  ELSE 'false' ` +
    `    END AS "hasPermission" ` +
    `FROM tb_permission_api pa ` +
    "  LEFT JOIN ( " +
    "    SELECT * " +
    "    FROM tb_permission_api_group" +
    "    WHERE " +
    `      LOWER(group_id) = LOWER($1) ` +
    "  ) pag ON pa.permission_api_id = pag.permission_api_id " +
    "INNER JOIN tb_function f ON pa.function_id = f.function_id " +
    `WHERE 1=1 AND pa.status = 'Active' `;

  //dynamic filter
  let counter = 2;
  queryParams.push(param.groupId);

  if (param.functionId && param.functionId != "") {
    query += ` AND LOWER(f.function_id) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.functionId}%`);
  }

  if (param.functionName && param.functionName != "") {
    query += ` AND LOWER(f.function_name) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.functionName}%`);
  }

  if (param.action && param.action != "") {
    query += ` AND LOWER(pa.action) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.action}%`);
  }

  if (param.HTTPMethod && param.HTTPMethod != "") {
    query += ` AND LOWER(pa.http_method) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.HTTPMethod}%`);
  }

  if (param.APIURLName && param.APIURLName != "") {
    query += ` AND LOWER(pa.api_url_name) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.APIURLName}%`);
  }

  if (param.all && param.all != "") {
    query += ` AND (f.function_name ILIKE $${counter} or pa.action ILIKE $${counter} or pa.http_method ILIKE $${counter} or 
      pa.api_url_name ILIKE $${counter})`;
    queryParams.push(`%${param.all}%`);
  }

  // dynamic order
  if (param.orderBy && param.orderBy != "") {
    let dir = "asc";
    if (param.dir && (param.dir == "asc" || param.dir == "desc")) {
      dir = param.dir;
    }

    query += ` ORDER BY "${param.orderBy}" ${dir} `;
  } else {
    query += ` ORDER BY pa.api_url_name ASC `;
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
  const temp = await db.any(query, queryParams);
  const result = temp;
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

const updatePermissionAPIGroup = async (param, updatedBy) => {
  let query =
    " UPDATE tb_permission_api_group SET " +
    "   group_id = $1, " +
    "   permission_api_id = $2, " +
    "   updated_by = $3, " +
    "   updated_dt = $4 " +
    " WHERE " +
    "   permission_api_group_id = $5 ";

  let dt = new Date();
  await db.none(query, [
    param.groupId,
    param.permissionAPIId,
    updatedBy,
    dt,
    param.permissionAPIGroupId,
  ]);
};

const deleteManyPermissionAPIGroup = async (param) => {
  let formatString = `
    DELETE FROM 
      tb_permission_api_group
    WHERE 
      permission_api_group_id IN (%L)`;
  // const query =
  //   " DELETE FROM tb_permission_api_group " +
  //   " WHERE (permission_api_group_id) IN (($1:list))"
  // await db.query(query, param)

  let query = format(formatString, param);
  // console.log(query)
  await db.query(query, param);
};

const createManyPermissionAPIGroup = async (param) => {
  // sc: https://www.wlaurance.com/2018/09/node-postgres-insert-multiple-rows
  let formatString = `
    INSERT INTO 
      tb_permission_api_group (
        permission_api_group_id, 
        group_id,
        permission_api_id,
        created_by,
        created_dt,
        updated_by,
        updated_dt
    ) VALUES %L`;

  let query = format(formatString, param);
  await db.query(query, param);
};

const getPermissionAPIGroupByGroupId = async (groupId) => {
  let query =
    " SELECT " +
    '   pag.permission_api_group_id AS "permissionAPIGroupId", ' +
    '   pag.permission_api_id AS "permissionAPIId", ' +
    '   pa.action AS "action", ' +
    '   pa.http_method AS "HTTPMethod", ' +
    '   pa.api_url_name AS "APIURLName", ' +
    '   f.function_id AS "functionId", ' +
    '   f.function_name AS "functionName", ' +
    '   pag.group_id AS "groupId", ' +
    '   g.group_name AS "groupName" ' +
    " FROM tb_permission_api_group pag " +
    " INNER JOIN tb_permission_api pa ON pa.permission_api_id = pag.permission_api_id " +
    " INNER JOIN tb_group g ON g.group_id = pag.group_id " +
    " INNER JOIN tb_function f ON pa.function_id = f.function_id " +
    "   WHERE pa.status = $1 AND pag.group_id = $2 ";

  let permissionAPIGroup = await db.query(query, ["Active", groupId]);
  return permissionAPIGroup;
};

module.exports = {
  createPermissionAPIGroup,
  getPermissionAPIGroupById,
  deletePermissionAPIGroupById,
  searchPermissionAPIGroup,
  updatePermissionAPIGroup,
  deleteManyPermissionAPIGroup,
  createManyPermissionAPIGroup,
  getPermissionAPIGroupByGroupId,
};
