const cookie = require('cookie')

const { sessionExists } = require("../repository");

const upgradeAuth = async (request) => {
  const parsedCookies = cookie.parse(request.headers.cookie || "");
  const sessionToken = parsedCookies["jet-session"];

  if (!sessionToken || !(await sessionExists(sessionToken))) {
    return false;
  }
  return true
};

module.exports = upgradeAuth
