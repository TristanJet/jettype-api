const { createGuestUser, createSession } = require('../../repository/6379');
const createId = require('../utility/createId');

const createGuest = async () => {
  const userid = createId();
  const sessionid = createId();
  await createGuestUser(userid);
  return await createSession(userid, sessionid);
};

module.exports = createGuest;