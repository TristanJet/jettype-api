const { sessionExists } = require("../../repository");

const authcontroller = async (req, res, next) => {
  try {
    if (!req.cookies["jet-session"] || !(await sessionExists(req.cookies["jet-session"]))) {
      res.json({
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    } else {
      res.json({
        message: "Authorized",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = authcontroller;
