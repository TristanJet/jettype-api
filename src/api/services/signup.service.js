const verify = require('../utility/google-verify.service')
const { createUser } = require('../repository')

const signup = async (jwt) => {
  const decoded = await verify(jwt)
  const db = await createUser(decoded)
  console.log(db)
}

module.exports = signup
