const { getStartTime, getNameFromSession, addLeaderboard } = require('../repository')

const onWin = async (client) => {
  /* Win condition */
  console.log('WINN!!')
  const finishDate = Date.now()
  const startTime = await getStartTime(client)
  const finishTime = (finishDate - startTime)/1000
  console.log(`${client} typed the quote correctly in ${finishTime} seconds!`);
  const name = await getNameFromSession(client)
  await addLeaderboard(finishTime, name)
  //ws.send(`You typed the quote correctly in ${finishTime} seconds!`);
}

module.exports = onWin