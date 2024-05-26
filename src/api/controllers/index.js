const auth = require('./auth.controller');
const leaderboard = require('./leaderboard.controller');
const signin = require('./signin.controller');
const user = require('./user.controller');
const userPost = require('./user.post.controller');

module.exports = {
  auth,
  leaderboard,
  signin,
  user,
  userPost,
};
