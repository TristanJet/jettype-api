const {
  getUserIdFromSession,
  addUserName,
  getUserData,
  getFinishTimeSession,
  addLeaderboard,
} = require("../../repository/6379");

const userService = async (session) => {
  const userId = await getUserIdFromSession(session);
  return getUserData(userId);
};

const userPostService = async (session, name) => {
  /* Look at this function The redis things are fucking up */
  const userId = await getUserIdFromSession(session);
  await addUserName(userId, name);
  if (await getFinishTimeSession(session)) {
    await addLeaderboard(finishTime, name);
  }
};

module.exports = {
  userService,
  userPostService,
};
