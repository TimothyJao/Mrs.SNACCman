// const mongoose = require("mongoose");

const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const port = process.env.PORT || 5000;
const server = http.createServer(app);
<<<<<<< HEAD
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
=======
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
>>>>>>> 56f12481ce0da058883dea17ce86784eee9ba8e2

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/public"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "public", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.sendFile(path.resolve("../frontend/public/index.html"));
});

var roomno = 1;
io.on("connection", function(socket) {
  console.log("User Connected");
  if (
    io.nsps["/"].adapter.rooms["room-" + roomno] &&
    io.nsps["/"].adapter.rooms["room-" + roomno].length > 4
  )
    roomno++;
  socket.join("room-" + roomno);
  let clients = io.sockets.adapter.rooms["room-" + roomno].sockets;
  let numClients =
    typeof clients !== "undefined" ? Object.keys(clients).length : 0;
  console.log("room-" + roomno);

  userNum = 0;

  for (let clientId in clients) {
    let clientSocket = io.sockets.connected[clientId];

    if (userNum == 0) {
      clientSocket.role = "snaccman";
      let message =
        "You are a " +
        clientSocket.role +
        "! There are " +
        numClients +
        " players in your lobby";
      clientSocket.emit("connectToRoom", {
        message: message,
        playerNumber: userNum
      });
    } else {
      clientSocket.role = "ghost";
      let message =
        "You are a " +
        clientSocket.role +
        "! There are " +
        numClients +
        " players in your lobby";
      clientSocket.emit("connectToRoom", {
        message: message,
        playerNumber: userNum
      });
    }
    userNum++;
  }

  socket.on("getPrompt", () => {
    io.in("room-" + roomno).emit("sendPlayers", clients);
    for (let clientId in clients) {
      let clientSocket = io.sockets.connected[clientId];
      clientSocket.leave("room-1");
      clientSocket.join("game-1");
      console.log("You are joining this game");
    }
  });

  /* should return a pojo of a player   */
  socket.on("getPlayer", data => {
    // want to dispatch all changes to all players
    socket.to("game-1").emit("getPlayerData", {
      frame: data.frame,
      entity: data.entity,
      player: data.player
    });
  });

<<<<<<< HEAD
  /* should return a pojo of all players */
  // socket.on('getPlayers', (player) => {

  // })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
// }
=======
    var roomno = 1;
    io.on('connection', function (socket) {
        /*
        join lobby function: If value is -1 create a new room
        if value exists (check io.nsps['/'].adapter.rooms) use socket.join to bring them in
        else throw them an error message and bring them back to welcome page
        
        socket.on('joinLobby', ()=>{
            if(value === -1){
                let roomno = 0;
                while (roomno < 1000){
                    const roomno = Math.floor(Math.rand() * 10000)
                }
                socket.join("room-" + roomno);
                socket.emit('lobbyFound', true)
            } else if(!io.nsps['/'].adapter.rooms['room-' + value]){
                socket.emit('lobbyFound', false)
            } else{
                socket.emit('lobbyFound', false)
            }
        })
        */
        console.log('User Connected');
        if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length > 4) roomno++;
        socket.join("room-" + roomno);

        console.log(io.nsps['/'].adapter.rooms)
        let clients = io.sockets.adapter.rooms['room-' + roomno].sockets;
        
        console.log('room-' + roomno);

        sendMessage(clients, io)
        
        

        socket.on('getPrompt', () => {
            io.in('room-' + roomno).emit("sendPlayers", clients)
            for (let clientId in clients) {
                let clientSocket = io.sockets.connected[clientId];
                clientSocket.leave('room-' + roomno)
                clientSocket.join('game-' + roomno)
                console.log("You are joining this game-" + roomno)
            }
        });

        /* should return a pojo of a player   */
        socket.on('getPlayer', (data) => {
            // want to dispatch all changes to all players
            socket.to('game-1').emit('getPlayerData', { frame: data.frame, entity: data.entity, player: data.player})
        });

        socket.on('disconnect', () => {
            console.log('user disconnected')
            sendMessage(clients, io)
        });

       
    })

    sendMessage = (clients, io) => {
        let numClients = (typeof clients !== "undefined") ? Object.keys(clients).length : 0
        let userNum = 0;
        for (let clientId in clients) {
            let clientSocket = io.sockets.connected[clientId];

            if (userNum == 0) {

                let message = "You are Mrs.Snaccman! You are with " + [numClients-1] + " other player(s)";
                let roomIdMessage = "Room ID:" + roomno;
                clientSocket.emit('connectToRoom', { message: message, playerNumber: userNum, roomIdMessage: roomIdMessage });

            } else {

                let message = "You are a ghost! You are with " + [numClients-1] + " other player(s)";
                clientSocket.emit('connectToRoom', { message: message, playerNumber: userNum });
            }
            userNum++;
        }
    }

>>>>>>> 56f12481ce0da058883dea17ce86784eee9ba8e2

app.get("/", (req, res) => res.send("Hello, world!"));

server.listen(port, () => console.log(`Listening on port ${port}`));
