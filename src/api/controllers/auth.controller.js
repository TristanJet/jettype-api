const { sessionExists } = require("../../repository");

const authcontroller = async (req, res, next) => {
  try {
    if (!req.cookies["jet-session"] || !(await sessionExists(req.cookies["jet-session"]))) {
      res.json({
        authstatus: 0,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.json({
        authstatus: 1,
        token: req.cookies["jet-session"],
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = authcontroller;
