// const mongoose = require("mongoose");

const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

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
io.on('connection', function (socket) {
    /*
    join lobby function: If value is -1 create a new room
    if value exists (check io.nsps['/'].adapter.rooms) use socket.join to bring them in
    else throw them an error message and bring them back to welcome page
    */

    socket.on('joinLobby', (value)=>{
        if (value === -1 || (value === -2 && io.nsps['/'].adapter.rooms.length === 0)){
            let roomno = 0;
            const roomno = Math.floor(Math.rand() * 9000) + 1000
            socket.join("room-" + roomno);
            socket.emit('lobbyFound', true);
        } else if(value === -2){
            const roomno = Math.floor(Math.rand() * io.nsps['/'].adapter.rooms.length === 0)
            socket.join("room-" + roomno);
            socket.emit('lobbyFound', true);
        } else if(io.nsps['/'].adapter.rooms['room-' + value]){
            socket.join("room-" + value);
            socket.emit('lobbyFound', true);
        } else{
            socket.emit('lobbyFound', false);
        }
    })

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


app.get("/", (req, res) => res.send("Hello, world!"));

server.listen(port, () => console.log(`Listening on port ${port}`));
