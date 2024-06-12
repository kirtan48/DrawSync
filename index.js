const express = require("express");

const app = express();
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer);
app.use(express.static("public"));

let connections = [];

io.on("connect", (socket) => {
  connections.push(socket);
  console.log(`user connect id:${socket.id}`);

  socket.on("draw", (data) => {
    connections.forEach((con) => {
      if (con.id != socket.id) {
        con.emit("ondraw", { x: data.x, y: data.y });
      }
    });
  });
  socket.on("erase",(data)=>{
    connections.forEach((con)=>{
        if(con.id!=socket.id){
            con.emit("onerase",{x:data.x,y:data.y});
        }
    })
  })

  socket.on("disconnect", () => {
    connections = connections.filter((con) => con != socket.id);
  });
  socket.on("down", (data) => {
    connections.forEach((con) => {
      if (con.id != socket.id) {
        con.emit("move", { x: data.x, y: data.y });
      }
    });
  });
});

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log("SErver running");
});
