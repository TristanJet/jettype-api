const { pushGameState, popGameState } = require('../repository')

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
    onMessage(client, data)
  });
};

const onMessage = async (client, data) => {
  console.log(`Message: ${data}, from client: ${client}`);
  console.log(await pushGameState(client, data))
}

module.exports = wsServer
