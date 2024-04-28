const {
  getStartTime,
  clearGameState,
  getUserIdFromSession,
  getNameFromUser,
  addLeaderboard,
  getScore,
  appendAllWpm,
  popAllWpm,
  getAllWpm,
  updateAvgWpm,
} = require("../repository");

const onWin = async (client, wordCount) => {
  /* Win condition */
  console.log("WINN!!");
  const finishDate = Date.now();
  const startTime = await getStartTime(client);
  const finishTime = ((finishDate - startTime) / 1000).toFixed(1);
  const userId = await getUserIdFromSession(client);
  const name = await getNameFromUser(userId);
  const bestTime = await getScore(name) //Should this really be attached to the leaderboard object? Or should I store it in user.
  if (bestTime > finishTime) {
    await addLeaderboard(finishTime, name);
  }
  await clearGameState(client);
  const wpm = (wordCount / (finishTime / 60)).toFixed(1);
  console.log(`${client} typed the quote correctly in ${finishTime} seconds, with a wpm of: ${wpm}!`);
  return {
    type: "FIN",
    name: name,
    finishTime: finishTime,
    wpm: wpm,
  };
};

const addWpmAndAvg = async (client, wpm) => {
  const userId = await getUserIdFromSession(client);
  const respLen = await appendAllWpm(userId, wpm);
  if (respLen === 110) {
    await popAllWpm(userId);
  }
  if (respLen % 10 === 0) {
    const all = await getAllWpm(userId);

    const arrayAsFloats = all.map((item) => parseFloat(item));

    const average = (arrayAsFloats.reduce((acc, val) => acc + val, 0) / arrayAsFloats.length).toFixed(1);
    console.log(average)

    await updateAvgWpm(userId, average)
  }
};

module.exports = {
  onWin,
  addWpmAndAvg,
};
