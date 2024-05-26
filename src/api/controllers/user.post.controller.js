const { userPostService } = require('../services/user.service');

const userPost = async (req, res, next) => {
  try {
    const { name } = req.body;
    const session = req.cookies['jet-session'];
    await userPostService(session, name);
    res.json({
      message: 'Name update successful',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = userPost;
