const handleSignIn = require('../services/signin.service');

const signincontroller = async (req, res, next) => {
  try {
    const sessionId = await handleSignIn(req);
    res.cookie('jet-session', sessionId, {
      maxAge: 2600000 * 3 * 1000, //3 months in milliseconds
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });
    res.json({
      message: 'signin successful',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = signincontroller;
