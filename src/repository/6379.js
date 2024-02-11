const redis = require('redis');

const { exit } = require('node:process');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on('error', (err) => {
  console.log('Redis client error:', err);
  exit(1);
});

(async () => {
  await client.connect();
})();

const createUser = async (id, name, email) => {
  await client.HSET(`user:${id}`, {
    name,
    email,
    wpm: 0,
    totalCrowns: 0,
  });
};

const createSession = async (userId, sessionId) => {
  await client.SET(`session:${sessionId}`, `user:${userId}`, {
    EX: 2600000,
  });
  return await client.HSET(`user:${userId}`, {
    sessionId,
  });
};

const pushGameState = async (sessionId, data) => await client.RPUSH(`gameState:${sessionId}`, data);

const setStartTime = async (sessionId, data) => await client.SET(`startTime:${sessionId}`, data);

const getStartTime = async (sessionId) => await client.GET(`startTime:${sessionId}`);

const popGameState = async (sessionId, data) => await client.RPOP_COUNT(`gameState:${sessionId}`, data);

const checkGameState = async (sessionId) => await client.LRANGE(`gameState:${sessionId}`, 0, -1);

const clearGameState = async (sessionId) => await client.DEL(`gameState:${sessionId}`);

const getSessionId = async (userId) => await client.HGET(`user:${userId}`, 'sessionId');

const userExists = async (id) => await client.EXISTS(`user:${id}`);

const sessionExists = async (sessionId) => await client.EXISTS(`session:${sessionId}`);

const getNameFromSession = async (sessionId) => {
  const user = await client.GET(`session:${sessionId}`);
  return await client.HGET(user, 'name');
};

const addLeaderboard = async (time, name) => await client.ZADD('leaderboard', { score: time, value: name });

const getLeaderboard = async () => await client.ZRANGE_WITHSCORES('leaderboard', 0, -1);

module.exports = {
  createUser,
  createSession,
  pushGameState,
  setStartTime,
  getStartTime,
  popGameState,
  checkGameState,
  clearGameState,
  getSessionId,
  userExists,
  sessionExists,
  getNameFromSession,
  addLeaderboard,
  getLeaderboard,
};
