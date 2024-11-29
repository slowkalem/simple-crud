const { db } = require("../helper/DBUtil");

const createGroup = async (param, createdBy) => {
  let query =
    " INSERT INTO tb_group " +
    " (group_id, " +
    " group_name, " +
    " group_desc, " +
    " created_by, " +
    " created_dt, " +
    " updated_by, " +
    " updated_dt) " +
    " VALUES " +
    " ($1,$2,$3,$4,$5,$6,$7) ";

  let dt = new Date();
  await db.none(query, [
    param.groupId,
    param.name,
    param.description,
    createdBy,
    dt,
    createdBy,
    dt,
  ]);
};

const getGroupById = async (groupId) => {
  let query =
    " SELECT " +
    '   group_id AS "groupId", ' +
    '   group_name AS "name", ' +
    '   group_desc AS "description" ' +
    " FROM tb_group " +
    "   WHERE group_id = $1 ";

  let group = await db.oneOrNone(query, [groupId]);
  return group;
};

const deleteGroupById = async (groupId) => {
  let query = ` DELETE FROM tb_group WHERE group_id = $1 `;
  await db.none(query, [groupId]);
};

const searchGroup = async (param) => {
  let queryParams = [];

  // query
  let query =
    "SELECT " +
    '  u.group_id AS "groupId", ' +
    '  u.group_name AS "name", ' +
    '  u.group_desc AS "description" ' +
    "FROM tb_group u " +
    "  WHERE 1=1  ";

  //dynamic filter
  let counter = 1;
  if (param.groupId && param.groupId != "") {
    query += ` AND LOWER(u.group_id) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.groupId}%`);
  }

  if (param.name && param.name != "") {
    query += ` AND LOWER(u.group_name) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.name}%`);
  }

  if (param.description && param.description != "") {
    query += ` AND LOWER(u.group_desc) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.description}%`);
  }

  if (param.all && param.all != "") {
    query += ` AND (u.group_name ILIKE $${counter} OR u.group_desc ILIKE $${counter}) `;
    queryParams.push(`%${param.all}%`);
  }

  let dir = "asc";
  if (param.dir && (param.dir == "asc" || param.dir == "desc")) {
    dir = param.dir;
  }
  // dynamic order
  if (param.orderBy && param.orderBy != "") {
    query += ` ORDER BY "${param.orderBy}" ${dir} `;
  } else {
    query += ` ORDER BY u.group_name ${dir} `;
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

const updateGroup = async (param, updatedBy) => {
  let query =
    " UPDATE tb_group SET " +
    "   group_name = $1, " +
    "   group_desc = $2, " +
    "   updated_by = $3, " +
    "   updated_dt = $4 " +
    " WHERE " +
    "   group_id = $5 ";

  let dt = new Date();
  await db.none(query, [
    param.name,
    param.description,
    updatedBy,
    dt,
    param.groupId,
  ]);
};

module.exports = {
  createGroup,
  getGroupById,
  deleteGroupById,
  searchGroup,
  updateGroup,
};
