const redis = require("redis");

const genAvgWpm = require("../api/utility/genAvgWpm");

const { exit } = require("node:process");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => {
  console.log("Redis client error:", err);
  exit(1);
});

(async () => {
  await client.connect();
})();

const createSignedUser = async (id, name, email) => {
  await client.HSET(`user:${id}`, {
    authType: "signed",
    name,
    email,
    avgWPM: 0,
    totalCrowns: 0,
  });
};

const createGuestUser = async (id) => {
  const setresp = await client.HSET(`user:${id}`, {
    authType: "guest",
    name: "",
    avgWPM: 0,
    totalCrowns: 0,
  });
  const expresp = await client.EXPIRE(`user:${id}`, 600000); // 1 week
  if (setresp && expresp) {
    return 1;
  }
  return 0;
};

const addUserName = async (id, name) =>
  await client.HSET(`user:${id}`, { name });

const getUserData = async (id) =>
  await client.HMGET(`user:${id}`, ["name", "avgWPM", "totalCrowns"]);

const migrate = async (
  signedUserId,
  guestUserId,
  guestSessionId,
  guestName,
  guestTotalCrowns,
) => {
  if (guestName) {
    await client.HSET(`user:${signedUserId}`, {
      name: guestName,
    });
  }
  if (guestTotalCrowns) {
    await client.HINCRBY(
      `user:${signedUserId}`,
      "totalCrowns",
      guestTotalCrowns,
    );
  }

  const guestAllWpm = await client.LRANGE(`allWpm:${guestUserId}`, 0, -1);
  let newLength = 0;
  if (guestAllWpm.length) {
    newLength = await appendAllWpm(signedUserId, guestAllWpm);
  }
  const newAvg = await genAvgWpm(
    signedUserId,
    newLength,
    async (userId, num) => {
      return await popAllWpm(userId, num);
    },
    async (userId) => {
      return await getAllWpm(userId);
    },
  );
  if (newAvg) {
    updateAvgWpm(signedUserId, newAvg);
  }
  await client.DEL([
    `user:${guestUserId}`,
    `session:${guestSessionId}`,
    `allWpm:${guestUserId}`,
  ]);
};

const createSession = async (userId, sessionId, authType) => {
  const sessionSetResp = await client.HSET(`session:${sessionId}`, {
    authType,
    userId: `${userId}`,
    isStarted: "false",
    startDate: 0,
  });
  let sessionExpResp;
  if (authType === "guest") {
    sessionExpResp = await client.EXPIRE(`session:${sessionId}`, 600000); // 1 week
  } else if (authType === "signed") {
    sessionExpResp = await client.EXPIRE(`session:${sessionId}`, 2600000 * 3); // 3 month
  }
  const linkSeshUserResp = await client.HSET(`user:${userId}`, {
    sessionId,
  });
  if (sessionSetResp && sessionExpResp && linkSeshUserResp) {
    return 1;
  }
  return 0;
};

const pushGameState = async (sessionId, data) =>
  await client.RPUSH(`gameState:${sessionId}`, data);

const setStartDate = async (sessionId, data) =>
  await client.HSET(`session:${sessionId}`, {
    startDate: data,
  });

const getStartDate = async (sessionId) =>
  await client.HGET(`session:${sessionId}`, "startDate");

const popGameState = async (sessionId, data) =>
  await client.RPOP_COUNT(`gameState:${sessionId}`, data);

const checkGameState = async (sessionId) =>
  await client.LRANGE(`gameState:${sessionId}`, 0, -1);

const clearGameState = async (sessionId) =>
  await client.DEL(`gameState:${sessionId}`);

const getSessionId = async (userId) =>
  await client.HGET(`user:${userId}`, "sessionId");

const userExists = async (id) => await client.EXISTS(`user:${id}`);

const sessionExists = async (sessionId) =>
  await client.EXISTS(`session:${sessionId}`);

const getAuthTypeFromSession = async (sessionId) =>
  await client.HGET(`session:${sessionId}`, "authType");

const getUserIdFromSession = async (sessionId) =>
  await client.HGET(`session:${sessionId}`, "userId");

const finishTimeToSession = async (sessionId, finishTime) =>
  client.HSET(`session:${sessionId}`, {
    finishTime,
  });

const getFinishTimeSession = async (sessionId) =>
  client.HGET(`session:${sessionId}`, "finishTime");

const getNameFromUser = async (userId) =>
  await client.HGET(`user:${userId}`, "name");

const getAuthTypeFromUser = async (userId) =>
  await client.HGET(`user:${userId}`, "authType");

const addLeaderboard = async (time, name) =>
  await client.ZADD("leaderboard", { score: time, value: name });

const getScore = async (name) => await client.ZSCORE("leaderboard", name);

const getLeaderboard = async () =>
  await client.ZRANGE_WITHSCORES("leaderboard", 0, -1);

const appendAllWpm = async (userId, listOrString) =>
  await client.RPUSH(`allWpm:${userId}`, listOrString);

const popAllWpm = async (userId, num) =>
  await client.LPOP_COUNT(`allWpm:${userId}`, num);

const clearAllWpm = async (userId) => await client.DEL(`allWpm:${userId}`);

const getAllWpm = async (userId) =>
  await client.LRANGE(`allWpm:${userId}`, 0, -1);

const updateAvgWpm = async (id, wpm) => {
  await client.HSET(`user:${id}`, {
    avgWPM: wpm,
  });
};

module.exports = {
  createSignedUser,
  createGuestUser,
  addUserName,
  getUserData,
  migrate,
  createSession,
  pushGameState,
  setStartDate,
  getStartDate,
  popGameState,
  checkGameState,
  clearGameState,
  getSessionId,
  userExists,
  sessionExists,
  getAuthTypeFromSession,
  getUserIdFromSession,
  finishTimeToSession,
  getFinishTimeSession,
  getNameFromUser,
  getAuthTypeFromUser,
  addLeaderboard,
  getScore,
  getLeaderboard,
  appendAllWpm,
  popAllWpm,
  clearAllWpm,
  getAllWpm,
  updateAvgWpm,
};
