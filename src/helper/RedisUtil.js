const { createClient } = require("redis");

class Redis {
  static #instance = null;

  static async getClient() {
    if (!Redis.#instance) {
      try {
        Redis.#instance = createClient({
          url: process.env.REDIS_URL,
        });
        await Redis.#instance.connect();
        return Redis.#instance;
      } catch (err) {
        console.error(err.message);
        throw new Error(`Error Redis ${err.message}`);
      }
    } else {
      return Redis.#instance;
    }
  }
}

module.exports = { Redis };
