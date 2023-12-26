const cookie = require('cookie')

const { sessionExists } = require("../repository");

const onUpgrade = async (request, socket) => {
  const pathname = request.url;

  if (pathname === '/ws') {

    await upgradeAuth(request, socket)
    /*wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });*/
  } else {
    socket.destroy();
  }
}

const upgradeAuth = async (request, socket) => {
  console.log('here auth')
  const parsedCookies = cookie.parse(request.headers.cookie || "");
  const sessionToken = parsedCookies["jet-session"];

  if (!sessionToken || !(await sessionExists(sessionToken))) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  console.log(`This token is good: ${request.headers.cookie}`);
  socket.destroy();
};

module.exports = onUpgrade
