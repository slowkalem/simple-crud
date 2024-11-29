const { db } = require('../helper/DBUtil')

const createPermissionAPI = async (param, createdBy) => {
  let query =
    ' INSERT INTO tb_permission_api ' +
    ' (permission_api_id, ' +
    ' function_id, ' +
    ' action, ' +
    ' http_method, ' +
    ' api_url_name, ' +
    ' status, ' +
    ' created_by, ' +
    ' created_dt, ' +
    ' updated_by, ' +
    ' updated_dt) ' +
    ' VALUES ' +
    ' ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) '

  let dt = new Date()
  await db.none(query, [
    param.permissionAPIId,
    param.functionId,
    param.action,
    param.HTTPMethod,
    param.APIURLName,
    param.status,
    createdBy,
    dt,
    createdBy,
    dt,
  ])
}

const getPermissionAPIById = async (permissionAPIId) => {
  let query =
    ' SELECT ' +
    '   pa.permission_api_id AS "permissionAPIId", ' +
    '   pa.function_id AS "functionId", ' +
    '   f.function_name AS "functionName", ' +
    '   pa.action AS "action", ' +
    '   pa.http_method AS "HTTPMethod", ' +
    '   pa.api_url_name AS "APIURLName", ' +
    '   pa.status AS "status" ' +
    ' FROM tb_permission_api pa ' +
    ' INNER JOIN tb_function f ON pa.function_id = f.function_id ' +
    '   WHERE pa.permission_api_id = $1 '

  let permissionAPI = await db.oneOrNone(query, [permissionAPIId])
  return permissionAPI
}

const deletePermissionAPIById = async (permissionAPIId) => {
  let query = ` DELETE FROM tb_permission_api WHERE permission_api_id = $1 `
  await db.none(query, [permissionAPIId])
}

const searchPermissionAPI = async (param) => {
  let queryParams = []

  // query
  let query =
    'SELECT '
    + '  pa.permission_api_id AS "permissionAPIId", '
    + '  pa.function_id AS "functionId", '
    + '  f.function_name AS "functionName", '
    + '  pa.action AS "action", '
    + '  pa.http_method AS "HTTPMethod", '
    + '  pa.api_url_name AS "APIURLName", '
    + '  pa.status AS "status" '
    + 'FROM tb_permission_api pa '
    + 'INNER JOIN tb_function f ON pa.function_id = f.function_id '
    + '  WHERE 1=1  '

  //dynamic filter 
  let counter = 1;
  if (param.permissionAPIId && param.permissionAPIId != "") {
    query += ` AND LOWER(pa.permission_api_id) LIKE LOWER($${counter++})`
    queryParams.push(`%${param.permissionAPIId}%`)
  }

  if (param.functionId && param.functionId != "") {
    query += ` AND LOWER(pa.function_id) LIKE LOWER($${counter++})`
    queryParams.push(`%${param.functionId}%`)
  }

  if (param.functionName && param.functionName != "") {
    query += ` AND LOWER(f.function_name) LIKE LOWER($${counter++})`
    queryParams.push(`%${param.functionName}%`)
  }

  if (param.action && param.action != "") {
    query += ` AND LOWER(pa.action) LIKE LOWER($${counter++})`
    queryParams.push(`%${param.action}%`)
  }

  if (param.HTTPMethod && param.HTTPMethod != "") {
    query += ` AND LOWER(pa.http_method) LIKE LOWER($${counter++})`
    queryParams.push(`%${param.HTTPMethod}%`)
  }

  if (param.APIURLName && param.APIURLName != "") {
    query += ` AND LOWER(pa.api_url_name) LIKE LOWER($${counter++})`
    queryParams.push(`%${param.APIURLName}%`)
  }

  if (param.status && param.status != "") {
    query += ` AND LOWER(pa.status) LIKE LOWER($${counter++})`;
    queryParams.push(param.status);
  }

  // dynamic order
  if (param.orderBy && param.orderBy != "") {
    let dir = 'asc'
    if (param.dir && (param.dir == "asc" || param.dir == 'desc')) {
      dir = param.dir
    }

    query += ` ORDER BY "${param.orderBy}" ${dir} `
  } else {
    query += ` ORDER BY f.function_name ASC `
  }

  let totalRows = await db.query(query, queryParams)

  if (!totalRows.length) {
    return {
      page: param.page,
      perPage: param.perPage,
      totalRows: 0,
      totalPages: 0,
      result: [],
    }
  }

  // limit and paging and such
  if (!param.perPage || param.perPage == "") {
    param.perPage = parseInt(process.env.ROW_PAGE)
  }

  limit = param.perPage

  let offset = 0
  if (param.page && param.page != "") {
    offset = limit * (param.page - 1)
  }

  query += ` LIMIT ${limit} OFFSET ${offset} `
  const temp = await db.any(query, queryParams)
  const result = temp
  totalRows = totalRows.length
  let totalPages = Math.ceil(totalRows / param.perPage)

  return {
    page: param.page,
    perPage: param.perPage,
    totalRows,
    totalPages,
    result,
  }
}

const updatePermissionAPI = async (param, updatedBy) => {
  let query =
    ' UPDATE tb_permission_api SET ' +
    '   function_id = $1, ' +
    '   action = $2, ' +
    '   http_method = $3, ' +
    '   api_url_name = $4, ' +
    '   status = $5, ' +
    '   updated_by = $6, ' +
    '   updated_dt = $7 ' +
    ' WHERE ' +
    '   permission_api_id = $8 '

  let dt = new Date()
  await db.none(query, [
    param.functionId,
    param.action,
    param.HTTPMethod,
    param.APIURLName,
    param.status,
    updatedBy,
    dt,
    param.permissionAPIId,
  ])
}



module.exports = {
  createPermissionAPI,
  getPermissionAPIById,
  deletePermissionAPIById,
  searchPermissionAPI,
  updatePermissionAPI
}