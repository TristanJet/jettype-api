const auth = require('./auth.controller');
const quote = require('./quote.controller');
const leaderboard = require('./leaderboard.controller');
const signin = require('./signin.controller');
const user = require('./user.controller');
const userPost = require('./user.post.controller');
const guest = require('./guest.controller');

module.exports = {
  auth,
  quote,
  leaderboard,
  signin,
  user,
  userPost,
  guest,
};
