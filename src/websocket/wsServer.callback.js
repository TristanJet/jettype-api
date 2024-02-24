const {
  pushGameState,
  setStartTime,
  getIsStarted,
  setIsStarted,
  popGameState,
  checkGameState,
  clearGameState,
} = require('../repository');

const endGame = require('./endGame');

const quote = 'Theory can only take you so far.';

const wsServer = (ws, request, client) => {
  console.log(`Connection gucci: ${client}`);
  clearGameState(client)

  ws.on('error', (err) => {
    socket.destroy();
    console.log(`Websocket error: ${err}`);
  });

  ws.on('close', () => {
    console.log(`${client} has disconnected`);
  });

  ws.on('message', (data) => {
    data = JSON.parse(data);
    onMessage(ws, client, data);
  });
};

const onMessage = async (ws, client, data) => {
  let resp;

  for (const command of data.commands) {
      if (command.cmd === 'ADD') {
        resp = await pushGameState(client, command.val);
        const isStarted = await getIsStarted(client)
        if (isStarted === 'false') {
          const startTime = Date.now();
          await setStartTime(client, startTime);
          await setIsStarted(client, 'true')
        }
        if (resp === quote.length) {
          const gameState = await checkGameState(client);
          if (gameState.join('') === quote) { // Win condition!!
            const endData = await endGame(client);
            await setIsStarted(client, 'false')
            ws.send(JSON.stringify(endData))
            break;
          }
        }
      } else if (command.cmd === 'DEL') {
        resp = await popGameState(client, command.num);
      }
  }
};

module.exports = wsServer;
