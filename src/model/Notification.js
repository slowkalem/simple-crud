const { db } = require("../helper/DBUtil");
const format = require("pg-format");

/* get */
const getNotification = async (param) => {
  let queryParams = [param.userId];

  // query
  let query =
    'SELECT n.notification_id as "notificationId", n.message, n.created_dt, \
        CASE WHEN EXISTS(SELECT 1 FROM tb_notification_read nr where n.notification_id = nr.notification_id AND nr.user_id = $1) \
            THEN 1 \
            ELSE 0 \
        END as isRead \
    FROM tb_notification n \
    WHERE 1=1 and n.user_id = $1';

  // dynamic condition and parameters
  let counter = 2;
  if (param.notificationId && param.notificationId !== "") {
    queryParams.push(param.notificationId);
    query += `AND n.notification_id = $${counter}`;
    counter++;
  }
  if (
    param.isRead !== null &&
    param.isRead !== "" &&
    param.isRead !== undefined
  ) {
    queryParams.push(param.userId);
    const read = param.isRead ? "" : "NOT";
    query += ` AND ${read} EXISTS(SELECT 1 FROM tb_notification_read nr WHERE n.notification_id = nr.notification_id AND nr.user_id = $${counter})`;
    counter++;
  }

  // dynamic order
  if (param.orderBy && param.orderBy !== "" && param.orderBy !== undefined) {
    let dir = "asc";
    let orderBy;
    if (param.dir && (param.dir === "asc" || param.dir === "desc")) {
      dir = param.dir;
    }
    switch (param.orderBy) {
      case "isread":
        orderBy = "isread";
        break;
      case "date":
        orderBy = "n.created_dt";
        break;
      default:
        orderBy = "n.created_dt";
    }
    query += ` ORDER BY ${orderBy} ${dir} `;
  } else {
    query += " ORDER BY n.created_dt DESC ";
  }

  // limit and paging and such
  if (!param.perPage || param.perPage === "") {
    param.perPage = parseInt(process.env.ROW_PAGE);
  }

  // const limit = param.perPage;

  // let offset = 0;
  // if (param.page && param.page !== "") {
  //   offset = limit * (param.page - 1);
  // }

  // query += ` LIMIT ${limit} OFFSET ${offset} `;
  const result = await db.any(query, queryParams);
  const totalRows = result.length;
  const totalPages = Math.ceil(totalRows / param.perPage);

  return {
    page: param.page,
    perPage: param.perPage,
    totalPages,
    totalRows,
    result,
  };
};

const insertNotification = async (param) => {
  let query =
    "INSERT INTO tb_notification " +
    "(notification_id, user_id, group_id, message, created_dt, created_by, updated_dt, updated_by) " +
    "VALUES " +
    "($1, $2, $3, $4, $5, $6, $7, $8) ";

  let dt = new Date();
  await db.any(query, [
    param.notificationId,
    param.userId,
    param.groupId,
    param.message,
    dt,
    param.createdBy,
    dt,
    param.createdBy,
  ]);
};

const readNotification = async (param, createdBy) => {
  let query = `INSERT INTO tb_notification_read \
    (notification_read_id, notification_id, user_id, created_dt, created_by, updated_dt, updated_by) \
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
  let dt = new Date();
  await db.any(query, [
    param.notificationReadId,
    param.notificationId,
    param.userId,
    dt,
    createdBy,
    dt,
    createdBy,
  ]);
};

const readManyNotification = async (param) => {
  let formatString = `INSERT INTO tb_notification_read \
    (notification_read_id, notification_id, user_id, created_dt, created_by, updated_dt, updated_by) \
    VALUES %L`;
  let query = format(formatString, param);
  await db.any(query, param);
};

const countUnreadNotification = async (receiver) => {
  try {
    let queryParams = [receiver.userId];
    let query =
      `SELECT CASE WHEN (nr.notification_read_id IS NULL) THEN '0' ELSE '1' END AS "isRead"` +
      ` FROM tb_notification n LEFT JOIN tb_notification_read nr` +
      ` ON n.notification_id = nr.notification_id` +
      ` WHERE n.user_id = $1`;
    let result = await db.any(query, queryParams);
    result = result.filter((x) => x.isRead == 0);
    return result.length;
  } catch (err) {
    result = {
      err: err.message,
      data: null,
    };
    return result;
  }
};

module.exports = {
  getNotification,
  insertNotification,
  readNotification,
  readManyNotification,
  countUnreadNotification,
};
