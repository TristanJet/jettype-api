const http = require('http')
const WebSocket = require('ws')

const app = require('./app');
const onUpgrade = require('./websocket')

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket) => {
  onUpgrade(request, socket)
});

server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
