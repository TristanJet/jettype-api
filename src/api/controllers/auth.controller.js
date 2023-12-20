const { sessionExists } = require("../repository");

const authcontroller = async (req, res, next) => {
  try {
    if (!req.cookies["jet-session"] || !(await sessionExists(req.cookies["jet-session"]))) {
      res.json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
        IP: req.ip,
        URL: req.originalUrl,
      });
    } else {
      res.json({
        message: "Authorized",
        timestamp: new Date().toISOString(),
        IP: req.ip,
        URL: req.originalUrl,
      });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = authcontroller;
