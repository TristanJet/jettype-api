const wsServer = (ws, request, client) => {
  console.log(`This token is good: ${request.headers.cookie}`);
  console.log("Connection gucci");

  ws.on("error", (err) => {
    socket.destroy();
    console.log(`Websocket error: ${err}`);
  });

  ws.on('close', () => {
    console.log(`${client} has disconnected`)
  })

  ws.on("message", (data) => {
    console.log(`Message: ${data}, from client: ${client}`);
  });
};

module.exports = wsServer
