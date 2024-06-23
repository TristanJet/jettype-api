const genAvgWPM = require("../api/utility/genAvgWpm");

const {
  getStartDate,
  clearGameState,
  getUserIdFromSession,
  finishTimeToSession,
  getNameFromUser,
  getAuthTypeFromUser,
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
  const startTime = await getStartDate(client);
  const finishTime = ((finishDate - startTime) / 1000).toFixed(1);
  const userId = await getUserIdFromSession(client);
  const authType = await getAuthTypeFromUser(userId);
  const wpm = (wordCount / (finishTime / 60)).toFixed(1);
  let name;
  if (authType === "signed") {
    console.log("signed");
    name = await namedFasho(userId, finishTime, wpm);
  } else if (authType === "guest") {
    console.log("guest");
    name = await namedMaybe(userId, client, finishTime);
  }
  await clearGameState(client);
  console.log(
    `${client} typed the quote correctly in ${finishTime} seconds, with a wpm of: ${wpm}!`,
  );
  addAndAverage(
    userId,
    wpm,
    async (session, num) => {
      return await popAllWpm(session, num);
    },
    async (userid) => {
      return await getAllWpm(userid);
    },
  );
  return {
    type: "FIN",
    name,
    finishTime,
    wpm,
  };
};

const namedFasho = async (userId, finishTime) => {
  console.log("function running");
  const name = await getNameFromUser(userId);
  const bestTime = await getScore(name); // Should this really be attached to the leaderboard object? Or should I store it in user.
  if (bestTime) {
    if (bestTime < finishTime) {
      return name;
    }
  }
  await addLeaderboard(finishTime, name);
  return name;
};

const namedMaybe = async (userId, client, finishTime) => {
  if (!(await getNameFromUser(userId))) {
    await finishTimeToSession(client, finishTime);
    return "";
  }
  return namedFasho(userId, finishTime);
};

const addAndAverage = async (userId, wpm, pop, get) => {
  const length = await appendAllWpm(userId, wpm);
  const average = await genAvgWPM(userId, length, pop, get);
  if (average) {
    updateAvgWpm(userId, average);
  }
};

module.exports = onWin;
