const {
  pushGameState,
  setStartTime,
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

  const init = new Map(); // Add to redis?????
  ws.on('message', (data) => {
    data = JSON.parse(data);
    onMessage(ws, client, data, init);
  });
};

const onMessage = async (ws, client, data, init) => {
  let resp;

  for (const command of data.commands) {
      if (command.cmd === 'ADD') {
        resp = await pushGameState(client, command.val);
        if (!init.get(client)) {
          const startTime = Date.now();
          await setStartTime(client, startTime);
          init.set(client, true);
        }
        if (resp === quote.length) {
          const gameState = await checkGameState(client);
          if (gameState.join('') === quote) { // Win condition!!
            const endData = await endGame(client);
            init.set(client, false)
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
