const verify = require('../utility/google-verify')
const createId = require('../utility/createId')
const { createUser, createSession } = require('../repository')

const user = async (jwt) => {
  const decoded = await verify(jwt);
  const created = await createUser(decoded.sub, decoded.given_name, decoded.email);
  if (created) {
    throw new Error('User already exists')
  }
  return decoded.sub
}

const session = async (userId) => {
  const sessionId = createId();
  await createSession(userId, sessionId);
  return sessionId;
}

module.exports = {
  user,
  session
}
