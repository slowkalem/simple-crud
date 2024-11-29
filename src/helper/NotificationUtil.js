const { Redis } = require("../helper/RedisUtil");
const { getNotification } = require("../model/Notification");

async function GetNotification(param) {
  let result = [];

  // get redis client
  const redisClient = await Redis.getClient();

  if (
    await redisClient.exists(
      `SCM_notification_${process.env.ENV}_${param.userId}`
    )
  ) {
    result = JSON.parse(
      await redisClient.get(
        `SCM_notification_${process.env.ENV}_${param.userId}`
      )
    );
  }
  return result;
}

async function UpdateNotification(param) {
  // get redis client
  const redisClient = await Redis.getClient();

  // set latest notification into redis as acache
  const { result } = await getNotification(param);
  await redisClient.set(
    `SCM_notification_${process.env.ENV}_${param.userId}`,
    JSON.stringify(result || []),
    {
      EX: parseInt(process.env.REDIS_TTL),
    }
  );
}

module.exports = { GetNotification, UpdateNotification };
