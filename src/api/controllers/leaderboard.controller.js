const lbservice = require('../services/leaderboard.service');

const lbcontroller = async (req, res, next) => {
  const arr = await lbservice();
  try {
    if (arr.length) {
      res.json({
        content: arr,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.statusCode = 204;
      res.json({
        message: 'No entries in leaderboard yet!',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = lbcontroller;
