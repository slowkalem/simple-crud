const { db } = require("../helper/DBUtil");

//combo system
const getCombo = async (param) => {
  const queryParams = [param.sysCat, param.sysSubCat];
  let query =
    ` SELECT value, remark as "label"` +
    ` FROM tb_system WHERE sys_cat = $1 AND sys_sub_cat = $2`;

  // dynamic order
  if (param.sysCode && param.sysCode != "") {
    queryParams.push(param.sysCode);
    query += ` AND sys_code = $3`;
  }

  if (param.orderBy && param.orderBy !== "" && param.orderBy !== undefined) {
    let dir = "asc";
    let orderBy;
    if (param.dir && (param.dir === "asc" || param.dir === "desc")) {
      dir = param.dir;
    }
    switch (param.orderBy) {
      case "sysCat":
        orderBy = "sys_cat";
        break;
      case "sysSubCat":
        orderBy = "sys_sub_cat";
        break;
      case "sysCode":
        orderBy = "sys_code::int";
        break;
      case "value":
        orderBy = "value";
        break;
      case "remark":
        orderBy = "remark";
        break;
      default:
        orderBy = "remark";
    }
    query += ` ORDER BY ${orderBy} ${dir} `;
  } else {
    query += " ORDER BY remark ASC";
  }

  const combo = await db.any(query, queryParams);
  return combo;
};

//combo system
const getComboWithCode = async (param) => {
  const queryParams = [param.sysCat, param.sysSubCat];
  let query =
    ` SELECT sys_code as "value", value as "label"` +
    ` FROM tb_system WHERE sys_cat = $1 AND sys_sub_cat = $2`;

  if (param.orderBy && param.orderBy !== "" && param.orderBy !== undefined) {
    let dir = "asc";
    let orderBy;
    if (param.dir && (param.dir === "asc" || param.dir === "desc")) {
      dir = param.dir;
    }
    switch (param.orderBy) {
      case "sysCat":
        orderBy = "sys_cat";
        break;
      case "sysSubCat":
        orderBy = "sys_sub_cat";
        break;
      case "sysCode":
        orderBy = "sys_code::int";
        break;
      case "value":
        orderBy = "value";
        break;
      case "remark":
        orderBy = "remark";
        break;
      default:
        orderBy = "remark";
    }
    query += ` ORDER BY ${orderBy} ${dir} `;
  } else {
    query += " ORDER BY remark ASC";
  }

  const combo = await db.any(query, queryParams);
  return combo;
};

//combo system
const getComboValue = async (param) => {
  const queryParams = [param.sysCat, param.sysSubCat];
  let query =
    ` SELECT value, value as "label"` +
    ` FROM tb_system WHERE sys_cat = $1 AND sys_sub_cat = $2`;

  if (param.sysCode && param.sysCode != "") {
    queryParams.push(param.sysCode);
    query += ` AND sys_code = $3`;
  }

  if (param.orderBy && param.orderBy !== "" && param.orderBy !== undefined) {
    let dir = "asc";
    let orderBy;
    if (param.dir && (param.dir === "asc" || param.dir === "desc")) {
      dir = param.dir;
    }
    switch (param.orderBy) {
      case "sysCat":
        orderBy = "sys_cat";
        break;
      case "sysSubCat":
        orderBy = "sys_sub_cat";
        break;
      case "sysCode":
        orderBy = "sys_code::int";
        break;
      case "value":
        orderBy = "value";
        break;
      case "remark":
        orderBy = "remark";
        break;
      default:
        orderBy = "remark";
    }
    query += ` ORDER BY ${orderBy} ${dir} `;
  } else {
    query += " ORDER BY remark ASC";
  }

  const combo = await db.any(query, queryParams);
  return combo;
};

//combo group
const getGroupCombo = async (param) => {
  let query =
    "SELECT " +
    'group_id as "value", group_name as "label" ' +
    "FROM tb_group WHERE 1=1 ";

  if (param.id && param.id != "") {
    query += `AND group_id = '${param.id}'`;
  }

  if (param.label && param.label != "") {
    query += `AND group_name ILIKE '%${param.label}%'`;
  }

  query += `ORDER BY group_id ASC`;

  const combo = await db.any(query);

  return combo;
};

//combo function
const getFunctionCombo = async (param) => {
  let query =
    "SELECT " +
    'function_id as "value", function_name as "label" ' +
    "FROM tb_function WHERE 1=1 ";

  if (param.id && param.id != "") {
    query += `AND function_id = '${param.id}'`;
  }

  if (param.label && param.label != "") {
    query += `AND function_name ILIKE '%${param.label}%'`;
  }

  query += ` ORDER BY function_id ASC`;

  const combo = await db.any(query);

  return combo;
};

const getFilterSystemCatCombo = async (param) => {
  let query =
    `SELECT DISTINCT ON (sys_cat) sys_cat ` + "FROM tb_system " + "WHERE 1=1 ";

  if (param.sysCat && param.sysCat !== "") {
    query += `AND sys_cat ILIKE '%${param.sysCat}%'`;
  }

  if (param.sysSubCat && param.sysSubCat !== "") {
    query += `AND sys_sub_cat ILIKE '%${param.sysSubCat}%'`;
  }

  if (param.sysCode && param.sysCode !== "") {
    query += `AND sys_code ILIKE '%${param.sysCode}%'`;
  }

  const combo = await db.any(query);

  return combo;
};

const getFilterSystemSubCatCombo = async (param) => {
  let query =
    `SELECT DISTINCT ON (sys_sub_cat) sys_sub_cat ` +
    "FROM tb_system " +
    "WHERE 1=1 ";

  if (param.sysCat && param.sysCat !== "") {
    query += `AND sys_cat ILIKE '%${param.sysCat}%'`;
  }

  if (param.sysSubCat && param.sysSubCat !== "") {
    query += `AND sys_sub_cat ILIKE '%${param.sysSubCat}%'`;
  }

  if (param.sysCode && param.sysCode !== "") {
    query += `AND sys_code ILIKE '%${param.sysCode}%'`;
  }

  const combo = await db.any(query);

  return combo;
};

const getFilterSystemCodeCombo = async (param) => {
  let query =
    `SELECT DISTINCT ON (sys_code) sys_code ` +
    "FROM tb_system " +
    "WHERE 1=1 ";

  if (param.sysCat && param.sysCat !== "") {
    query += `AND sys_cat ILIKE '%${param.sysCat}%'`;
  }

  if (param.sysSubCat && param.sysSubCat !== "") {
    query += `AND sys_sub_cat ILIKE '%${param.sysSubCat}%'`;
  }

  if (param.sysCode && param.sysCode !== "") {
    query += `AND sys_code ILIKE '%${param.sysCode}%'`;
  }

  const combo = await db.any(query);

  return combo;
};

module.exports = {
  getCombo,
  getComboValue,
  getComboWithCode,
  getGroupCombo,
  getFunctionCombo,
  getFilterSystemCatCombo,
  getFilterSystemSubCatCombo,
  getFilterSystemCodeCombo,
};
