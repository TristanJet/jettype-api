const { getUserIdFromSession, getUserData } = require('../../repository/6379');

const userService = async (session) => {
  const userId = await getUserIdFromSession(session);
  return await getUserData(userId);
};

module.exports = userService;
