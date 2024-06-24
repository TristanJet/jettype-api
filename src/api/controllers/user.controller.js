const { userService } = require("../services/user.service");

const userController = async (req, res, next) => {
  const sessionToken = req.cookies["jet-session"];
  let [name, avgWPM, totalCrowns] = await userService(sessionToken);
  try {
    res.json({
      content: {
        username: name,
        data: {
          avgWPM,
          totalCrowns,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = userController;
