const http = require('http');
const WebSocket = require('ws');

const upgradeAuth = require('./websocket/auth');
const wsServer = require('./websocket/wsServer.callback');
const app = require('./app');

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true, clientTracking: true });

wss.on('connection', wsServer);

server.on('upgrade', (request, socket, head) => {
  try {
    const parsedMsg = new URL(request.url, 'http://localhost:5000');

    if (parsedMsg.pathname === '/ws') {
      console.log('Calling upgradeAuth'); // Confirm upgradeAuth is called
      upgradeAuth(parsedMsg.search)
        .then((token) => {
          console.log('Authentication successful', token); // Log on successful auth
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, socket, token, () => wss.clients.size);
            console.log(`Clients: ${wss.clients.size}`);
          });
        })
        .catch((error) => { // Catch and log any error from the promise
          console.error('Authentication failed:', error);
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
        });
    } else {
      console.log('Unauthorized connection attempted - pathname mismatch');
      console.log(parsedMsg);
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  } catch (error) {
    console.error('On connect error:', error); // Log catched errors
    socket.destroy();
  }
});

server.listen(port, () => {
   
  console.log(`Listening: http://localhost:${port}`);
   
});
