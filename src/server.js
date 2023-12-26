const http = require('http')
const WebSocket = require('ws')

const app = require('./app');
const upgradeAuth = require('./websocket')

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, request) => {
  console.log(`This token is good: ${request.headers.cookie}`);
  console.log('Connection gucci')
  ws.close()
})

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url;
  if (pathname === '/ws') {
    upgradeAuth(request)
      .then(authed => {
        if (authed) {
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
          });
        } else {
          console.log('Unauthorized connection attempted')
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();
        }
      })
  } else {
    console.log('Unauthorized connection attempted')
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});


server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
