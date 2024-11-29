const { db } = require("../helper/DBUtil");

/* get one user */
const getOneUser = async (userId) => {
  let query =
    `SELECT ` +
    `user_id AS "userId", ` +
    `group_id AS "groupId", ` +
    `username, ` +
    `full_name AS "fullName", ` +
    `email, ` +
    `status, ` +
    `phone, ` +
    `password, ` +
    `profile_photo AS "profilePhoto", ` +
    `otp AS "OTP", ` +
    `otp_valid_time AS "OTPValidTime" ` +
    `FROM tb_user ` +
    `WHERE user_id = $1 `;
  var user = await db.oneOrNone(query, [userId]);
  return user;
};

/* get one user */
const getUserById = async (userId) => {
  let query =
    `SELECT ` +
    `user_id AS "userId", ` +
    `group_id AS "groupId", ` +
    `username, ` +
    `full_name AS "fullName", ` +
    `email, ` +
    `status, ` +
    `phone, ` +
    `profile_photo AS "profilePhoto", ` +
    `otp AS "OTP", ` +
    `otp_valid_time AS "OTPValidTime" ` +
    `FROM tb_user ` +
    `WHERE user_id = $1 `;
  var user = await db.oneOrNone(query, [userId]);
  return user;
};

const getUserByEmail = async (email) => {
  let query =
    `SELECT ` +
    `user_id AS "userId", ` +
    `group_id AS "groupId", ` +
    `username, ` +
    `full_name AS "fullName", ` +
    `email, ` +
    `status, ` +
    `phone, ` +
    `password, ` +
    `profile_photo AS "profilePhoto", ` +
    `otp AS "OTP", ` +
    `otp_valid_time AS "OTPValidTime" ` +
    `FROM tb_user ` +
    `WHERE LOWER(email) = $1 `;
  const user = await db.oneOrNone(query, [email.toLowerCase()]);
  return user;
};

const getUserByUsername = async (username) => {
  let query =
    `SELECT ` +
    `user_id AS "userId", ` +
    `group_id AS "groupId", ` +
    `username, ` +
    `full_name AS "fullName", ` +
    `email, ` +
    `status, ` +
    `phone, ` +
    `password, ` +
    `profile_photo AS "profilePhoto", ` +
    `otp AS "OTP", ` +
    `otp_valid_time AS "OTPValidTime" ` +
    `FROM tb_user ` +
    `WHERE username = $1 `;
  const user = await db.oneOrNone(query, [username]);
  return user;
};

const changePassword = async (param, updatedBy) => {
  let query =
    " UPDATE tb_user SET " +
    "   password = $1, " +
    "   updated_dt = $2, " +
    "   updated_by = $3 " +
    " WHERE " +
    "   user_id = $4 ";

  let dt = new Date();
  await db.none(query, [param.newPassword, dt, updatedBy, param.userId]);
};

const updateOTPDB = async (param, updatedBy) => {
  let query =
    " UPDATE tb_user SET " +
    "   otp = $1, " +
    "   otp_valid_time = $2, " +
    "   updated_dt = $3, " +
    "   updated_by = $4 " +
    " WHERE " +
    "   user_id = $5 ";

  let dt = new Date();
  await db.none(query, [
    param.OTP,
    param.OTPValidTime,
    dt,
    updatedBy,
    param.userId,
  ]);
};

const getIncorrectPassword = async (userId) => {
  let query =
    `SELECT ` +
    `  incorrect_password_counter AS "incorrectPasswordCounter", ` +
    `  incorrect_password_valid_time AS "incorrectPasswordValidTime" ` +
    `FROM tb_user ` +
    `  WHERE user_id = $1 `;
  var user = await db.oneOrNone(query, [userId]);
  return user;
};

const updateIncorrectPasswordCounter = async (param, updatedBy) => {
  let query =
    " UPDATE tb_user SET " +
    "   incorrect_password_counter = $1, " +
    "   updated_dt = $2, " +
    "   updated_by = $3 " +
    " WHERE " +
    "   user_id = $4 ";
  let dt = new Date();
  await db.none(query, [
    param.incorrectPasswordCounter,
    dt,
    updatedBy,
    param.userId,
  ]);
};

const updateIncorrectPasswordValidTime = async (param, updatedBy) => {
  let query =
    " UPDATE tb_user SET " +
    "   incorrect_password_valid_time = $1, " +
    "   updated_dt = $2, " +
    "   updated_by = $3 " +
    " WHERE " +
    "   user_id = $4 ";

  let dt = new Date();
  await db.none(query, [
    param.incorrectPasswordValidTime,
    dt,
    updatedBy,
    param.userId,
  ]);
};

const updateOTPVerificationDB = async (param, updatedBy) => {
  let query =
    " UPDATE tb_user SET " +
    "   is_otp_verified = $1, " +
    "   updated_dt = $2, " +
    "   updated_by = $3 " +
    " WHERE " +
    "   email = $4 ";

  let dt = new Date();
  await db.none(query, [param.isOTPVerified, dt, updatedBy, param.email]);
};

const getOTPVerificationDB = async (userId) => {
  let query =
    `SELECT is_otp_verified AS "isOTPVerified" ` +
    `FROM tb_user ` +
    `WHERE email = $1 `;
  var user = await db.oneOrNone(query, [userId]);
  return user;
};

/**
 * Admin Portal
 */
const createUser = async (param, createdBy) => {
  let query =
    " INSERT INTO tb_user " +
    " (user_id, " +
    " username, " +
    " full_name, " +
    " password, " +
    " email, " +
    " status, " +
    " phone, " +
    " group_id, " +
    " profile_photo, " +
    " created_by, " +
    " created_dt, " +
    " updated_by, " +
    " updated_dt) " +
    " VALUES " +
    " ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ";
  let dt = new Date();

  await db.none(query, [
    param.userId,
    param.username,
    param.fullName,
    param.password,
    param.email,
    param.status,
    param.phone,
    param.groupId,
    param.profilePhoto,
    createdBy,
    dt,
    createdBy,
    dt,
  ]);
};

const searchUser = async (param) => {
  let queryParams = [];

  // query
  let query =
    "SELECT " +
    '  u.user_id AS "userId", ' +
    '  u.full_name AS "fullName", ' +
    '  u.status AS "status", ' +
    '  u.group_id AS "groupId" ' +
    "FROM tb_user u " +
    "  WHERE 1=1  ";

  //dynamic filter
  let counter = 1;

  if (param.fullName && param.fullName != "") {
    query += ` AND LOWER(u.full_name) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.fullName}%`);
  }

  if (param.status && param.status != "") {
    query += ` AND LOWER(u.status) LIKE LOWER($${counter++})`;
    queryParams.push(param.status);
  }

  if (param.groupId && param.groupId != "") {
    query += ` AND LOWER(u.group_id) LIKE LOWER($${counter++})`;
    queryParams.push(`%${param.groupId}%`);
    // queryParams.push(param.groupId);
  }

  // dynamic order
  if (param.orderBy && param.orderBy != "") {
    let dir = "asc";
    if (param.dir && (param.dir == "asc" || param.dir == "desc")) {
      dir = param.dir;
    }

    query += ` ORDER BY "${param.orderBy}" ${dir} `;
  } else {
    query += ` ORDER BY u.full_name ASC `;
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

  limit = param.perPage;

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

const deleteUserById = async (userId) => {
  let query = ` DELETE FROM tb_user WHERE user_id = $1 `;
  await db.none(query, [userId]);
};

const updateUser = async (param, updatedBy) => {
  let queryParams = [
    param.username,
    param.fullName,
    param.email,
    param.status,
    param.phone,
    param.groupId,
    param.profilePhoto,
    new Date(),
    updatedBy,
  ];
  let query =
    " UPDATE tb_user SET " +
    " username = $1, " +
    " full_name = $2, " +
    " email = $3, " +
    " status = $4, " +
    " phone = $5, " +
    " group_id = $6, " +
    " profile_photo = $7, " +
    " updated_dt = $8, " +
    " updated_by = $9 ";

  let counter = 10;
  if (param.password && param.password != "") {
    query += ` , password = $${counter}`;
    queryParams.push(param.password);
    counter++;
  }
  query += ` WHERE user_id = $${counter}`;
  queryParams.push(param.userId);
  await db.none(query, queryParams);
};

const updateStatus = async (param, updatedBy) => {
  let query =
    " UPDATE tb_user SET " +
    "   status = $1, " +
    "   updated_dt = $2, " +
    "   updated_by = $3 " +
    " WHERE " +
    "   user_id = $4 ";

  let dt = new Date();
  await db.none(query, [param.status, dt, updatedBy, param.userId]);
};

module.exports = {
  getOneUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  changePassword,
  updateUser,
  updateOTPDB,
  updateOTPVerificationDB,
  getOTPVerificationDB,
  searchUser,
  createUser,
  deleteUserById,
  getIncorrectPassword,
  updateIncorrectPasswordCounter,
  updateIncorrectPasswordValidTime,
  updateStatus,
};
