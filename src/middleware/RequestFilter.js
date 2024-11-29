const { Unauthorized } = require("../helper/ResponseUtil");
const { verifyJwt, getJwtToken } = require("../helper/JwtUtil");
const { getPermission } = require("../helper/PermissionUtil");

const getToken = (bearer) => {
  return bearer.slice(7, bearer.length);
};

const JwtFilter = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = await getToken(req.headers.authorization);

    if (verifyJwt(req, token)) {
      if (process.env.ENV != "test") {
        // Cek token DB
        let redisToken = await getJwtToken(req.user.userId);
        if (redisToken == null) {
          Unauthorized(res, "Sesi anda sudah berakhir, silahkan login kembali");
        } else if (redisToken != token) {
          Unauthorized(
            res,
            "Sepertinya anda telah login di tab atau browser lain. Untuk tetap login, pastikan hanya login disalah satu tab atau browser"
          );
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      Unauthorized(res, "Token tidak valid");
    }
  } else {
    Unauthorized(res, "Token tidak ada");
  }
};

const PermissionFilter = (perm) => {
  return async (req, res, next) => {
    let hasPermission = false;
    const HTTPMethod = perm[0];
    const APIURLName = perm[1];

    const data = await getPermission(req.user.groupId);
    if (!data) {
      return Unauthorized(res, "Token tidak valid");
    }

    for (let i in data) {
      if (
        HTTPMethod == data[i].HTTPMethod &&
        APIURLName == data[i].APIURLName
      ) {
        hasPermission = true;
        break;
      }
    }

    if (!hasPermission) {
      return Unauthorized(res, "Anda tidak memiliki akses!");
    }

    next();
  };
};

const KeyFilter = async (req, res, next) => {
  if (req.headers.authorization) {
    const key = req.headers.authorization;

    if (key == process.env.API_KEY) {
      next();
    } else {
      Unauthorized(res, "Token tidak valid");
    }
  } else {
    Unauthorized(res, "Token tidak ada");
  }
};

module.exports = { JwtFilter, PermissionFilter, KeyFilter };
