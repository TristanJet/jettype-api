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
  return sessionId;
};

const handleSignin = async (req) => {
  if (!req.cookies['jet-session'] || !(await sessionExists(req.cookies['jet-session']))) {
    return await createUserAndSession(req.body.credential);
  }

  if (await getAuthTypeFromSession(req.cookies['jet-session'] === 'guest')) {
    let guestUserId = await getUserIdFromSession(req.cookies['jet-session']);
    if (await userExists(guestUserId)) {
      const [name, avgWPM, totalCrowns] = await getUserData(guestUserId);
      const signedUserId = req.body.credential;
      const sessionId = await createUserAndSession(signedUserId);
      await setUserData(signedUserId, name, avgWPM, totalCrowns);
      return sessionId
    }
  }

  return await createUserAndSession(req.body.credential);

}

module.exports = handleSignin;
