const { getUserIdFromSession, addUserName, getUserData } = require('../../repository/6379');

const userService = async (session) => {
  const userId = await getUserIdFromSession(session);
  return await getUserData(userId);
};

const userPostService = async (session, name) => {
  const userId = await getUserIdFromSession(session);
  return await addUserName(userId, name);
};

module.exports = {
  userService,
  userPostService,
};
