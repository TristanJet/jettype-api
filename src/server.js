//const http = require('http')
const https = require('https')
const WebSocket = require('ws')
const fs = require('node:fs');

const upgradeAuth = require('./websocket/auth')
const wsServer = require('./websocket/wsServer.callback')
const app = require('./app');

const privateKey = fs.readFileSync('./127.0.0.1+1-key.pem');
const certificate = fs.readFileSync('./127.0.0.1+1.pem');
const port = process.env.PORT || 5000;
//const server = http.createServer(app);
const server = https.createServer({key: privateKey, cert: certificate}, app);
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
  console.log(`Listening: https://localhost:${port}`);
  /* eslint-enable no-console */
});
