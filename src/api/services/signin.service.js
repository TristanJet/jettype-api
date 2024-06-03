const verify = require('../utility/google-verify');
const createId = require('../utility/createId');
const {
  createSignedUser, getUserData, setUserData, createSession, userExists, sessionExists, getAuthTypeFromSession, getUserIdFromSession,
} = require('../../repository');

const createUserAndSession = async (jwt) => {
  /*Creates user if user doesn't exist, always creates session*/
  const decoded = await verify(jwt);
  if (!await userExists(decoded.sub)) {
    await createSignedUser(decoded.sub, decoded.given_name, decoded.email);
  }
  const sessionId = createId();
  await createSession(decoded.sub, sessionId, 'signed');
  return [decoded.sub, sessionId];
};

const handleSignin = async (req) => {
  if (!req.cookies['jet-session']) {
    const [userId, sessionId] = await createUserAndSession(req.body.credential);
    return sessionId;
  }
  if (!(await sessionExists(req.cookies['jet-session']))) {
    const [userId, sessionId] = await createUserAndSession(req.body.credential);
    return sessionId;
  }
  if (await getAuthTypeFromSession(req.cookies['jet-session']) === 'guest') {
    let guestUserId = await getUserIdFromSession(req.cookies['jet-session']);
    if (await userExists(guestUserId)) {
      const [name, avgWPM, totalCrowns] = await getUserData(guestUserId);
      const [signedUserId, sessionId] = await createUserAndSession(req.body.credential);
      await setUserData(signedUserId, name, avgWPM, totalCrowns);
      return sessionId
    }
  }
}

module.exports = handleSignin;
