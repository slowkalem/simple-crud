const { GetMsg } = require("../helper/MessageUtil");

const Ok = (res, msg, data) => {
  createMsg(res, 200, msg, data);
};

const BadRequest = (res, msg) => {
  createMsg(res, 400, msg, undefined, "Bad Request");
};

const NotFound = (res, msg) => {
  createMsg(res, 404, msg, null);
};

const Unauthorized = (res, msg) => {
  createMsg(res, 401, msg, undefined, "Unauthorized");
};

const InternalServerErr = (res, msg) => {
  createMsg(res, 500, msg, undefined, "Internal Server Error");
};

const SearchOk = (res, page, perPage, totalRows, totalPages, data) => {
  res.append(
    "Access-Control-Expose-Headers",
    "Page, Per-Page, Total-Rows, Total-Pages"
  );
  res.append("Page", page);
  res.append("Per-Page", perPage);
  res.append("Total-Rows", totalRows);
  res.append("Total-Pages", totalPages);
  const msg = GetMsg("found");
  createMsg(res, 200, msg, data);
};

const SearchNotFound = (res, page, perPage, totalRows, totalPages, data) => {
  res.append(
    "Access-Control-Expose-Headers",
    "Page, Per-Page, Total-Rows, Total-Pages"
  );
  res.append("Page", page);
  res.append("Per-Page", perPage);
  res.append("Total-Rows", totalRows);
  res.append("Total-Pages", totalPages);
  const msg = GetMsg("not.found");
  createMsg(res, 404, msg, data);
};

const createMsg = (res, statusCode, message = "", data, error) => {
  if (!data) {
    data = undefined;
  } else {
    data = data.length == 0 ? undefined : data;
  }
  res.status(statusCode).send({
    statusCode,
    message,
    data,
    error,
  });
};

module.exports = {
  Ok,
  BadRequest,
  Unauthorized,
  InternalServerErr,
  SearchOk,
  SearchNotFound,
  NotFound,
};
