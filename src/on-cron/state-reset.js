const { exit } = require("node:process");

const { getTop3, incrCrowns, clearLeaderboard } = require("../repository/6379");

const reset = async () => {
  const top3 = await getTop3();

  let numCrowns = 3;
  for (let i of top3) {
    const userId = i.split(":")[1];
    await incrCrowns(userId, numCrowns);
    numCrowns--;
  }
  await clearLeaderboard();
};

reset()
  .then(() => {
    console.log("reset successful");
    exit(0);
  })
  .catch(() => {
    console.log("reset failed");
    exit(1);
  });
