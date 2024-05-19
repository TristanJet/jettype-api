const { sessionExists } = require('../../repository');
const createGuest = require('../services/createguest.service');

const authcontroller = async (req, res, next) => {
  try {
    if (!req.cookies['jet-session'] || !(await sessionExists(req.cookies['jet-session']))) {
      const sessionId = await createGuest();
      if (sessionId) {
        res.status = 201;
        res.cookie('jet-session', sessionId, {
          maxAge: 600000 * 1000,
          httpOnly: true,
          path: '/',
          secure: true,
          sameSite: 'Strict',
        });
        res.json({
          message: 'Unauthorized, guest user created.',
          token: sessionId,
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error('Guest user || session creation failed');
      }
    } else {
      res.json({
        message: 'Authorized',
        token: req.cookies['jet-session'],
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = authcontroller;
