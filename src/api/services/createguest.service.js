const { createGuestUser, createSession } = require('../../repository/6379');
const createId = require('../utility/createId');

const createGuest = async () => {
  const userid = createId();
  const sessionid = createId();
  console.log(`session id${sessionid}`);
  const userResp = await createGuestUser(userid);
  console.log(`userresp${userResp}`);
  const sessionResp = await createSession(userid, sessionid, 'guest');
  console.log(`session resp${sessionResp}`);
  if (userResp && sessionResp) {
    return sessionid;
  }
  return 0;
};

module.exports = createGuest;
