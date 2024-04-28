const userService = require('../services/user.service')

const userController = async (req, res, next) => {
  const sessionToken = req.cookies['jet-session'];
  const [name, avgWPM, totalCrowns] = await userService(sessionToken);
  try {
    res.json({
      content: {
        username: name,
        data: {
          avgWPM: avgWPM,
          totalCrowns: totalCrowns,
        }
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = userController;