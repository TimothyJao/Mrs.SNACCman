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

let roomno;
let clients;
io.on('connection', function (socket) {
    //setup for socket
    console.log('User Connected');
    
    /*
    join lobby function: If value is -1 create a new room
    if value exists (check io.nsps['/'].adapter.rooms) use socket.join to bring them in
    else throw them an error message and bring them back to welcome page
    */      
    socket.on('joinLobby', (value) => {
        socket.leave("room-" + roomno)
        socket.leave("game-" + roomno)
        if (value === -1 || (value === -2 && io.nsps['/'].adapter.rooms.length === 0)){
            roomno = Math.floor(Math.random() * 9000) + 1000
            socket.join("room-" + roomno);
            socket.emit('lobbyFound', true);
            sendMessage(io, roomno)
        // } else if(value === -2){
        //     let rooms = Object.keys(io.sockets.adapter.rooms);
        //     for (let i = 0; i < rooms.length; i++){
        //         if (rooms[i].slice(0,4) === "room"){
        //             rooms = rooms.slice(i)
        //             break;
        //         }
        //     }
        //     roomno = Math.floor(Math.random() * rooms.length)
        //     socket.join(rooms[roomno]);
        //     socket.emit('lobbyFound', true);
        //     sendMessage(io, roomno)
        } else if (io.nsps['/'].adapter.rooms['room-' + value]) {
            socket.leave("room-" + roomno)
            roomno = value;
            clients = io.sockets.adapter.rooms['room-' + roomno].sockets;
            let numClients = (typeof clients !== "undefined") ? Object.keys(clients).length : 0
            if (numClients < 5){
                socket.join("room-" + value);
                socket.emit('lobbyFound', true);
                sendMessage(io, roomno)
            } else{
                socket.emit('lobbyFound', 'This lobby is full')
            }
            
        } else{
            socket.emit('lobbyFound', 'Lobby Not Found');
        }
    })    

    socket.on('getPrompt', () => {
        let players = Object.assign({}, clients)
        for (let clientId in clients) {
            let clientSocket = io.sockets.connected[clientId];
            clientSocket.leave('room-' + roomno)
            clientSocket.join('game-' + roomno)
            console.log("You are joining game-" + roomno)
        }
        io.in('game-' + roomno).emit("sendPlayers", players)
    });

    /* should return a pojo of a player   */
    socket.on('getPlayer', (data) => {
        // want to dispatch all changes to all players
        socket.to('game-' + roomno).emit('getPlayerData', { frame: data.frame, entity: data.entity, player: data.player})
    });

    socket.on('disconnect', () => {
        console.log('user disconnected')
        sendMessage(io, roomno)
    });

    
})

    sendMessage = (io, roomno) => {
        if (!io.sockets.adapter.rooms['room-' + roomno]) return null;
        clients = io.sockets.adapter.rooms['room-' + roomno].sockets;
        console.log('room-' + roomno);
        let numClients = (typeof clients !== "undefined") ? Object.keys(clients).length : 0
        let userNum = 0;
        for (let clientId in clients) { 
            let ghost;
            let clientSocket = io.sockets.connected[clientId];
            if (userNum == 0) {
                let message = "You are Mrs.Snaccman! You are with " + [numClients-1] + " other player(s)";
                let roomIdMessage = "Room ID:" + roomno;
                clientSocket.emit('connectToRoom', { message: message, playerNumber: userNum, roomIdMessage: roomIdMessage });

            } else {
                switch (userNum){
                    case 1:
                        ghost = "red";
                        break;
                    case 2:
                        ghost = "yellow";
                        break;
                    case 3:
                        ghost = "green";
                        break;
                    case 4:
                        ghost = "purple";
                        break;
                }
                let message = "You are the " + ghost + " ghost! You are with " + [numClients-1] + " other player(s)";
                clientSocket.emit('connectToRoom', { message: message, playerNumber: userNum });
            }
            userNum++;
        }
    }


app.get("/", (req, res) => res.send("Hello, world!"));

server.listen(port, () => console.log(`Listening on port ${port}`));
