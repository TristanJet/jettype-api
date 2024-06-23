const {
  pushGameState,
  setStartDate,
  popGameState,
  checkGameState,
  clearGameState,
} = require("../repository");

const onWin = require("./endGame");

const messageSchema = require("./msgValidation");

const quote = process.env.QUOTE;
const wordCount = quote.split(" ").length;

const wsServer = (ws, socket, client, getnclients) => {
  console.log(`Connection gucci: ${client}`);
  clearGameState(client);

  let lastInteractionTime = Date.now();

  // Set an interval to check for inactivity
  const intervalId = setInterval(() => {
    const now = Date.now();
    console.log("checking...");
    if (now - lastInteractionTime > 60 * 1000) {
      console.log(
        `${client} has been inactive for 1 minute, closing connection.`,
      );
      ws.close();
    }
  }, 15 * 1000);

  ws.on("error", (err) => {
    socket.destroy();
    console.log(`Websocket error: ${err}`);
  });

  ws.on("close", () => {
    console.log(`${client} has disconnected`);
    console.log(`Remaining clients: ${getnclients()}`);
    clearInterval(intervalId);
    clearGameState(client);
  });

  let hastyInputs = 0;
  ws.on("message", (data) => {
    const now = Date.now();
    const timeSince = now - lastInteractionTime;
    if (timeSince < 80) {
      // This is somewhat arbitrary, might break
      hastyInputs += 1;
      if (hastyInputs > 3) {
        ws.close();
        console.log(`${client} : Input was too quick.`);
      }
    } else if (hastyInputs) {
      hastyInputs = 0;
    }
    lastInteractionTime = now;
    data = JSON.parse(data);
    const validResp = messageSchema.validate(data);
    if (validResp.error) {
      console.log(`${client} : Message Validation error`);
      ws.close();
    }
    onMessage(ws, client, data);
  });
};

const onMessage = async (ws, client, data) => {
  for (const command of data.commands) {
    if (command.cmd === "ADD") {
      const resp = await pushGameState(client, command.val); // if resp == 1, then start timer
      if (resp === 1) {
        const startTime = Date.now();
        await setStartDate(client, startTime);
      } else if (resp === quote.length) {
        const gameState = await checkGameState(client);
        if (gameState.join("") === quote) {
          // Win condition!!
          const endData = await onWin(client, wordCount);
          ws.send(JSON.stringify(endData));
          break;
        }
      } else if (resp > quote.length) {
        console.log(`${client} : Input too long.`);
        ws.close();
      }
    } else if (command.cmd === "DEL") {
      const resp = await popGameState(client, command.num);
      if (!resp) {
        ws.close();
      }
    }
  }
};

module.exports = wsServer;
