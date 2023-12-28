const { pushGameState, popGameState, checkGameState } = require('../repository')

var quote = 'Theory'

const wsServer = (ws, request, client) => {
  console.log("Connection gucci");

  ws.on("error", (err) => {
    socket.destroy();
    console.log(`Websocket error: ${err}`);
  });

  ws.on('close', () => {
    console.log(`${client} has disconnected`)
  })

  ws.on("message", (data) => {
    data = JSON.parse(data)
    onMessage(client, data)
  });
};

const onMessage = async (client, data) => {
  console.log(`Message: ${data}, from client: ${client}`);
  let resp;

  for (const command of data.commands) {
      if (command.cmd === 'ADD') {
          resp = await pushGameState(client, command.val);
          if (resp === quote.length) {
              const gameState = await checkGameState(client);
              if (gameState.join('') === quote) {
                console.log(`${client} typed the quote correctly!`)
              }
          }
      } else if (command.cmd === 'DEL') {
          resp = await popGameState(client, command.num);
      }
      console.log(resp);
  }
};


module.exports = wsServer
