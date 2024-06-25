const { getLeaderboard } = require("../../repository/6379");

const lbservice = async () => {
  const lb = await getLeaderboard();

  lb.forEach((obj) => {
    obj.value = obj.value.split(":")[0];
  });
  return lb;
};

module.exports = lbservice;
