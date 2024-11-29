const { Redis } = require("../helper/RedisUtil");
const { getPermissionAPIGroupByGroupId } = require('../model/PermissionAPIGroup')

async function getPermission(groupId) {
  const redisClient = await Redis.getClient();

  if (!(await redisClient.exists(`SCM_perm_${process.env.ENV}_${groupId}`))) {
    const data = await getPermissionAPIGroupByGroupId(groupId)
    await redisClient.set(`SCM_perm_${process.env.ENV}_${groupId}`, JSON.stringify(data), {
      EX: parseInt(process.env.REDIS_TTL),
    });
  }

  return JSON.parse(await redisClient.get(`SCM_perm_${process.env.ENV}_${groupId}`));
}

async function updatePermission(groupId) {
  const redisClient = await Redis.getClient();

  // update cache
  const newData = await getPermissionAPIGroupByGroupId(groupId);
  await redisClient.set(`SCM_perm_${process.env.ENV}_${groupId}`, JSON.stringify(newData || []), {
    EX: parseInt(process.env.REDIS_TTL),
  });
}

module.exports = { getPermission, updatePermission };