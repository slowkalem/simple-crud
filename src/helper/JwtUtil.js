const { Redis } = require("../helper/RedisUtil");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const expired = process.env.JWT_EXPIRED;

const verifyJwt = (req, token) => {
  try {
    let decoded = jwt.verify(token, secret);

    // set userId into request
    req.user = {
      userId: decoded.userId,
      groupId: decoded.groupId,
      fullName: decoded.fullName,
      username: decoded.username,
      email: decoded.email,
      phone: decoded.phone,
    };
    return true;
  } catch (err) {
    return false;
  }
};

const createJwtToken = (data) => {
  return jwt.sign(data, secret, { expiresIn: expired });
};

const updateJwtToken = async (userId, token) => {
  const redisClient = await Redis.getClient();
  await redisClient.set(`SCM_token_${userId}`, token, {
    EX: parseInt(process.env.REDIS_TTL),
  });
}

const deleteJwtToken = async (userId) => {
  const redisClient = await Redis.getClient();
  await redisClient.del(`SCM_token_${userId}`);
}

const getJwtToken = async (userId) => {
  const redisClient = await Redis.getClient();
  return await redisClient.get(`SCM_token_${userId}`);
}

module.exports = { verifyJwt, createJwtToken, updateJwtToken, getJwtToken, deleteJwtToken };
