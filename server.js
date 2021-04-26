const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const clients = [];

wss.on("connection", (ws) => {
  const id = clients.length;
  clients[id] = ws;
  console.log(`New connection ${id}`);
  //сообщаем подключенному клиенту
  clients[id].send(
    JSON.stringify({
      type: "hello",
      message: `Hi your id equals ${id}`,
      data: id,
    })
  );
  //сообщяем всем другим
  clients.forEach((client) => {
    client.send(
      JSON.stringify({ type: "info", message: `We have new connection ${id}` })
    );
  });

  ws.on("message", (message) => {
    //тут можно вставить обработчик сообщения, почистить мат, удалить вредоносній код
    //sanitaize-html npm
    clients.forEach((client) => {
      client.send(
        JSON.stringify({
          type: "message",
          message: message,
          author: id,
        })
      );
    });
  });

  ws.on("close", (message) => {
    delete clients[id];
    clients.forEach((client) => {
      client.send(
        JSON.stringify({
          type: "info",
          message: `We have lost connection ${id}`,
        })
      );
    });
  });

  ws.on("error", (err) => console.log(err));
});

console.log("Startetd");
