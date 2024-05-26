const { getUserIdFromSession, addUserName, getUserData, getFinishTimeSession, addLeaderboard } = require('../../repository/6379');

const userService = async (session) => {
  const userId = await getUserIdFromSession(session);
  return await getUserData(userId);
};

const userPostService = async (session, name) => {
  const userId = await getUserIdFromSession(session);
  await addUserName(userId, name);
  const finishTime = await getFinishTimeSession(session);
  await addLeaderboard(finishTime, name);
};

module.exports = {
  userService,
  userPostService,
};
