const { createGuestUser, createSession } = require('../../repository/6379');
const createId = require('../utility/createId');

const createGuest = async () => {
  const userid = createId();
  const sessionid = createId();
  const userResp = await createGuestUser(userid);
  const sessionResp = await createSession(userid, sessionid, 'guest');
  if (userResp && sessionResp) {
    return sessionid;
  }
  return 0;
};

module.exports = createGuest;
