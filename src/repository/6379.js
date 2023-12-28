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
  await client.HSET(`user:${id}`, 
  {
    name: name,
    email: email,
    wpm: 0,
    totalCrowns: 0,
  }
  );
};

const createSession = async (userId, sessionId) => {
  await client.SET(
    `session:${sessionId}`,
    `user:${userId}`, {
      EX: 2600000
    }
  );
  await client.HSET(
    `user:${userId}`, 
    {
      sessionId: sessionId
    }
  )
}

const pushGameState = async (sessionId, data) => {
  return await client.RPUSH(`gameState:${sessionId}`, data)
}

const popGameState = async (sessionId, data) => {
  return await client.RPOP_COUNT(`gameState:${sessionId}`, data)
}

const checkGameState = async (sessionId) => {
  return await client.LRANGE(`gameState:${sessionId}`, 0, -1)
}

const getSessionId = async (userId) => {
  return await client.HGET(`user:${userId}`, 'sessionId')
}

const userExists = async (id) => {
  return await client.EXISTS(`user:${id}`)
}

const sessionExists = async (sessionId) => {
  return await client.EXISTS(`session:${sessionId}`)
}

module.exports = {
  createUser,
  createSession,
  pushGameState,
  popGameState,
  checkGameState,
  getSessionId,
  userExists,
  sessionExists
};
