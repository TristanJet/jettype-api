const verify = require('../utility/google-verify');
const createId = require('../utility/createId');
const {
  createUser, createSession, getSessionId, userExists, sessionExists,
} = require('../../repository');

const user = async (jwt) => {
  const decoded = await verify(jwt);
  if (!await userExists(decoded.sub)) {
    await createUser(decoded.sub, decoded.given_name, decoded.email);
    return [decoded.sub, 0];
  }
  return [decoded.sub, 1];
};

const session = async (userId, userExists) => {
  if (userExists) {
    const sessionId = await getSessionId(userId);
    if (await sessionExists(sessionId)) {
      return sessionId;
    }
  }
  const sessionId = createId();
  await createSession(userId, sessionId);
  return sessionId;
};

module.exports = {
  user,
  session,
};
