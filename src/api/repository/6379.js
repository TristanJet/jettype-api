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

const createUser = async (obj) => {
  return await client.HSET(`user:${obj.sub}`, {
    name: obj.given_name,
    email: obj.email,
    wpm: 0,
    totalCrowns: 0,
  });
};

module.exports = {
  createUser,
};
