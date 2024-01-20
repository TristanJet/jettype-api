const { getLeaderboard } = require("../../repository/6379");

const lbservice = async () => {
  return await getLeaderboard();
}

module.exports = lbservice
