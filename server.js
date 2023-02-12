const express = require("express");
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
    //extract the data from the message
    //update the array

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    //update the array
    // message.text().then((text) => {
    //   let data = text.split(" ");
    //   let arr_index = parseInt(data[0]);
    //   let arr_value = parseInt(data[1]);
    //   array[arr_index] = arr_value;
    // });
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

server.listen(8080, () => console.log(`Lisening on port :8080`));
