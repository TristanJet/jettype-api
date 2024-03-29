// import services
const signin = require('../services/signin.service');

const signincontroller = async (req, res, next) => {
  try {
    const [userId, userExists] = await signin.user(req.body.credential);
    const sessionId = await signin.session(userId, userExists);
    res.cookie('jet-session', sessionId, {
      maxAge: 2600000 * 1000,
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
