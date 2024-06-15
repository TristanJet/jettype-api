const { sessionExists, getAuthTypeFromSession} = require("../../repository");

const authcontroller = async (req, res, next) => {
  try {
    if (!req.cookies["jet-session"] || !(await sessionExists(req.cookies["jet-session"]))) {
      res.json({
        authstatus: 0,
        timestamp: new Date().toISOString(),
      });
    } else {
      const token = req.cookies["jet-session"];
      let signed = 0;
      if (await getAuthTypeFromSession(token) === 'signed') {
        signed = 1;
      }
      res.json({
        authstatus: 1,
        signed,
        token,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = authcontroller;
