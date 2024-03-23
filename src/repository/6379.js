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
  await client.HSET(`session:${sessionId}`, {
    userId:`${userId}`,
    isStarted: 'false',
  });

  await client.EXPIRE(`session:${sessionId}`, 2600000)
  return await client.HSET(`user:${userId}`, {
    sessionId,
  });
};

const pushGameState = async (sessionId, data) => await client.RPUSH(`gameState:${sessionId}`, data);

const setStartTime = async (sessionId, data) => await client.HSET(`session:${sessionId}`, {
  startTime: data,
});

const getStartTime = async (sessionId) => await client.HGET(`session:${sessionId}`, 'startTime');

const getIsStarted = async (sessionId) => {return await client.HGET(`session:${sessionId}`, 'isStarted')};

const setIsStarted = async (sessionId, state) => await client.HSET(`session:${sessionId}`, {
  isStarted: state,
});

const popGameState = async (sessionId, data) => await client.RPOP_COUNT(`gameState:${sessionId}`, data);

const checkGameState = async (sessionId) => await client.LRANGE(`gameState:${sessionId}`, 0, -1);

const clearGameState = async (sessionId) => await client.DEL(`gameState:${sessionId}`);

const getSessionId = async (userId) => await client.HGET(`user:${userId}`, 'sessionId');

const userExists = async (id) => await client.EXISTS(`user:${id}`);

const sessionExists = async (sessionId) => await client.EXISTS(`session:${sessionId}`);

const getUserIdFromSession = async (sessionId) => await client.HGET(`session:${sessionId}`, 'userId');

const getNameFromUser = async (userId) => await client.HGET(`user:${userId}`, 'name');

const addLeaderboard = async (time, name) => await client.ZADD('leaderboard', { score: time, value: name });

const getLeaderboard = async () => await client.ZRANGE_WITHSCORES('leaderboard', 0, -1);

const appendAllWpm = async (userId, num) => await client.RPUSH(`allWpm:${userId}`, num);

const popAllWpm = async (userId) => await client.LPOP_COUNT(`allWpm:${userId}`, 10);

const clearAllWpm = async (userId) => await client.DEL(`allWpm:${userId}`);

const getAllWpm = async (userId) => await client.LRANGE(`allWpm:${userId}`, 0, -1);

const updateAvgWpm = async (id, wpm) => {
  await client.HSET(`user:${id}`, {
    wpm: wpm,
  });
}

module.exports = {
  createUser,
  createSession,
  pushGameState,
  setStartTime,
  getStartTime,
  getIsStarted,
  setIsStarted,
  popGameState,
  checkGameState,
  clearGameState,
  getSessionId,
  userExists,
  sessionExists,
  getUserIdFromSession,
  getNameFromUser,
  addLeaderboard,
  getLeaderboard,
  appendAllWpm,
  popAllWpm,
  clearAllWpm,
  getAllWpm,
  updateAvgWpm,
};
