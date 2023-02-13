const express = require("express");
const path= require('path')
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

let array = [];
for (let i = 0; i < 64 * 64; i++) {
  array.push(0);
}

const wss = new WebSocket.Server({ server: server });

wss.on("connection", function connection(ws) {
    ws.send(array.toString());
  ws.on("message", function incoming(message) {
    console.log(typeof message);
    console.log(message);
    let values_ = message;
    let values = values_.toString().split(" ");
    
    let index = parseInt(values[0]);
    let value = parseInt(values[1]);
    array[index] = value;

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname,"/index.html")));
app.get("/awaker", (req, res) => {
  res.sendStatus(200)
})

server.listen(8080, () => console.log(`Lisening on port :8080`));
