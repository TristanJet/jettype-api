const { getLeaderboard } = require('../../repository/6379');

const lbservice = async () => await getLeaderboard();

module.exports = lbservice;
