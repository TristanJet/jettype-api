const lbservice = require("../services/leaderboard.service");

const lbcontroller = async (req, res, next) => {
  const arr = await lbservice();
  try {
    res.json({
      content: arr,
      timestamp: new Date().toISOString(),
      IP: req.ip,
      URL: req.originalUrl,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = lbcontroller;
