const {
  pushGameState,
  setStartTime,
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

  let lastInteractionTime;

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

  let hastyInputs = 0;
  ws.on('message', (data) => {
    const now = Date.now()
    if (String(data) === 'PONG') {
      console.log('HEre')
      return
    }
    const timeSince = now - lastInteractionTime
    console.log(timeSince)
    if (timeSince < 90) {//This is somewhat arbitrary, might break
      hastyInputs += 1;
      console.log(`quick: ${hastyInputs}`)
      if (hastyInputs > 3) {
        ws.close()
        console.log(`Input too quick!`)
        return
      }
    } else {
      if (hastyInputs) {
        hastyInputs = 0
      }
    }
    lastInteractionTime = now;
    data = JSON.parse(data);
    onMessage(ws, client, data);
  });
};

const onMessage = async (ws, client, data) => {

  for (const command of data.commands) {
      if (command.cmd === 'ADD') {
        const resp = await pushGameState(client, command.val); //if resp == 1, then start timer
        if (resp === 1) {
          const startTime = Date.now();
          await setStartTime(client, startTime);
        }
        if (resp === quote.length) {
          const gameState = await checkGameState(client);
          if (gameState.join('') === quote) { // Win condition!!
            const endData = await onWin(client, wordCount);
            ws.send(JSON.stringify(endData))
            addWpmAndAvg(client, endData.wpm)
            break;
          }
        }
      } else if (command.cmd === 'DEL') {
        await popGameState(client, command.num);
      }
  }
};

module.exports = wsServer;
