const { sessionExists } = require('../repository');

const upgradeAuth = (queryString) => new Promise(async (resolve, reject) => {
  if (!queryString) {
    return reject('No query string');
  }

  const params = new URLSearchParams(queryString);
  // Extract the value of "jet-token" or return false if it's not found

  if (!params.has('jet-token')) {
    return reject('Incorrect params');
  }

  const sessionToken = params.get('jet-token');
  // const sessionToken = parsedCookies["jet-session"];

  if (!sessionToken || !(await sessionExists(sessionToken))) {
    return reject('Invalid session');
  }
  return resolve(sessionToken);
});

module.exports = upgradeAuth;
