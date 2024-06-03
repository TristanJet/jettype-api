const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client();

const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  return ticket.getPayload();
};

module.exports = verify;
