const verify = require('../utility/google-verify')
const createId = require('../utility/createId')
const { createUser, createSession } = require('../repository')

const signup = async (jwt) => {
  const decoded = await verify(jwt);
  await createUser(decoded.sub, decoded.given_name, decoded.email);
  const sessionId = createId();
  await createSession(decoded.sub, sessionId)

  /**Create session, set cookie */
}

module.exports = signup
