const { sessionExists } = require('../repository')

const auth = async(req, res, next) => {
  if (!req.cookies["jet-session"] || !(await sessionExists(req.cookies["jet-session"]))) {
    return next(new Error('Unauthorized'))
  }
  return next()
}

module.exports = auth