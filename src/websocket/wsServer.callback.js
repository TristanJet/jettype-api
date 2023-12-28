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
    data = JSON.parse(data)
    onMessage(client, data)
  });
};

const onMessage = (client, data) => {
  console.log(`Message: ${data}, from client: ${client}`);
  let resp;
  data.commands.forEach(async (command) => {
    if (command.cmd === 'ADD') {
      resp = await pushGameState(client, command.val)
    } else if (command.cmd === 'DEL') {
      resp = await popGameState(client, command.num)
    }
  console.log(resp)
  });
}

module.exports = wsServer
