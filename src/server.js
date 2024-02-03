const http = require('http')
const WebSocket = require('ws')

const upgradeAuth = require('./websocket/auth')
const wsServer = require('./websocket/wsServer.callback')
const app = require('./app');

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', wsServer)

server.on('upgrade', (request, socket, head) => {
  try {
    const pathname = request.url;
    if (pathname === '/ws') {
      upgradeAuth(request)
        .then(token => {
          if (token) {
            wss.handleUpgrade(request, socket, head, (ws) => {
              wss.emit('connection', ws, request, token);
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
  } catch {
    socket.destroy()
    console.log('On connect error')
  }
});

server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
