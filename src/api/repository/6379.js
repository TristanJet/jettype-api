const redis = require("redis");

const { exit } = require("node:process");

let client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

client.on("error", (err) => {
  console.log("Redis client error:", err);
  exit(1);
});

(async () => {
  await client.connect();
})();

const createUser = async (id, name, email) => {
  return await client.HSET(`user:${id}`, {
    name: name,
    email: email,
    wpm: 0,
    totalCrowns: 0,
  });
};

const createSession = async (userId, sessionId) => {
  return await client.SET(
    `session:${sessionId}`,
    `user:${userId}`, {
      EX: 2600000
    }
  );
}

module.exports = {
  createUser,
  createSession
};