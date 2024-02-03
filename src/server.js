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
  console.log(`Upgrade request URL: ${request.url}`); // Log the request URL

  try {
    const pathname = request.url;
    console.log(`Attempting to upgrade for path: ${pathname}`); // Confirm the path being checked

    const parsedMsg = new URL(request.url, 'http://localhost:5000');

    if (parsedMsg.pathname === '/ws') {
      console.log('Calling upgradeAuth'); // Confirm upgradeAuth is called
      upgradeAuth(parsedMsg.search)
        .then(token => {
          console.log('Authentication successful', token); // Log on successful auth
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, token);
          });
        })
        .catch(error => { // Catch and log any error from the promise
          console.error('Authentication failed:', error);
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();
        });
    } else {
      console.log('Unauthorized connection attempted - pathname mismatch');
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
    }
  } catch (error) {
    console.error('On connect error:', error); // Log catched errors
    socket.destroy();
  }
});

server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
