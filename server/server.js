const webSocket = require("ws");

const wss = new webSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const code = `${msg}`;
    if (code === "100") {
      ws.send(JSON.stringify({ id: code, code: 200, message: "fuck index" }));
    }
    if (code === "200") {
      ws.send(
        JSON.stringify({ id: code, code: 200, message: "mother fuck about" })
      );
    }
  });
  ws.send("connection success");
});
