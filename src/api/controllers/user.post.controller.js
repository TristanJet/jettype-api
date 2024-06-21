const { userPostService } = require('../services/user.service');

const userPost = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    console.log(name);
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
