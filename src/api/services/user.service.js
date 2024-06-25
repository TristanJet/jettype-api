const procInstance = process.env.INSTANCE;

const {
  getUserIdFromSession,
  addUserName,
  getUserData,
  delFinishTime,
  getFinishTimeSession,
  addLeaderboard,
} = require("../../repository/6379");

const userService = async (session) => {
  const userId = await getUserIdFromSession(session);
  return getUserData(userId);
};

const userPostService = async (session, name) => {
  const userId = await getUserIdFromSession(session);
  await addUserName(userId, name);
  const string = await getFinishTimeSession(session);
  if (string) {
    const [finishTime, instance] = string.split(":");
    if (instance == procInstance) {
      await addLeaderboard(finishTime, name);
      await delFinishTime(session);
    } else {
      console.log("Previous time not accepted");
      await delFinishTime(session);
    }
  }
};

module.exports = {
  userService,
  userPostService,
};
