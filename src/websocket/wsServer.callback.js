const {
  pushGameState,
  setStartTime,
  getIsStarted,
  setIsStarted,
  popGameState,
  checkGameState,
  clearGameState,
} = require('../repository');

const {onWin, addWpmAndAvg} = require('./endGame');

const quote = 'Theory can only take you so far.';
const wordCount = quote.split(' ').length

const wsServer = (ws, request, client) => {
  console.log(`Connection gucci: ${client}`);
  clearGameState(client)

  let lastInteractionTime = Date.now();

  // Set an interval to check for inactivity
  const intervalId = setInterval(() => {
    const now = Date.now()
    ws.send('PING')
    console.log('pinging')
    if (now - lastInteractionTime > 60 * 1000) {
      console.log(`${client} has been inactive for 1 minute, closing connection.`);
      ws.close(); // Close the connection
    }    
  }, 15 * 1000);

  ws.on('error', (err) => {
    socket.destroy();
    console.log(`Websocket error: ${err}`);
  });

  ws.on('close', () => {
    console.log(`${client} has disconnected`);
    clearInterval(intervalId);
  });

  ws.on('message', (data) => {
    if (String(data) === 'PONG') {
      console.log('HEre')
    } else {
      lastInteractionTime = Date.now();
      data = JSON.parse(data);
      onMessage(ws, client, data);
    }
  });
};

const onMessage = async (ws, client, data) => {
  let resp;

  for (const command of data.commands) {
      if (command.cmd === 'ADD') {
        resp = await pushGameState(client, command.val); //if resp == 1, then start timer
        const isStarted = await getIsStarted(client)
        if (isStarted === 'false') {
          const startTime = Date.now();
          await setStartTime(client, startTime);
          await setIsStarted(client, 'true')
        }
        if (resp === quote.length) {
          const gameState = await checkGameState(client);
          if (gameState.join('') === quote) { // Win condition!!
            const endData = await onWin(client, wordCount);
            await setIsStarted(client, 'false')
            ws.send(JSON.stringify(endData))
            addWpmAndAvg(client, endData.wpm)
            break;
          }
        }
      } else if (command.cmd === 'DEL') {
        resp = await popGameState(client, command.num);
      }
  }
};

module.exports = wsServer;
