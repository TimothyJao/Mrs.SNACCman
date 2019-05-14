// const mongoose = require("mongoose");

const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function generateRandomId(len) {
    let result = "";
    for (let i = 0; i < len; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

// if (process.env.NODE_ENV === 'production') {
    //app.use(express.static('./'));
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('../frontend/public/index.html'));
    });

    var roomno = 1;
    io.on('connection', function (socket) {
        console.log('User Connected');
        //Increase roomno 2 clients are present in a room.
        if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length > 4) roomno++;
        socket.join("room-" + roomno);
        let clients = io.sockets.adapter.rooms['room-' + roomno].sockets;
        //Send this event to everyone in the room.
        let numClients = (typeof clients !== "undefined") ? Object.keys(clients).length : 0
        console.log('room-' + roomno);

        userNum = 0;
        
        for (let clientId in clients) {
            let clientSocket = io.sockets.connected[clientId];

            if (userNum == 0){

                clientSocket.role = "snaccman";
                let message = "You are a " + clientSocket.role + "! There are " + numClients + " players in your lobby";
                clientSocket.emit('connectToRoom', { message: message, playerNumber: userNum });

            } else{
                
                clientSocket.role = "ghost";
                let message = "You are a " + clientSocket.role + "! There are " + numClients + " players in your lobby";
                clientSocket.emit('connectToRoom', {message: message, playerNumber: userNum});
            }
            userNum++;
        }

        // for (let clientId in clients) {
        //     let clientSocket = io.sockets.connected[clientId]
        //     clientSocket.emit('connectToRoom', clientSocket.role)
        // }
        socket.on('getPrompt', () => {
            socket.emit("sendPlayers", clients)
        });
        
        socket.on('disconnect', () => {
            console.log('user disconnected')
        });

       //io.sockets.in("room-" + roomno).emit('connectToRoom', "You are in room no. " + roomno + ". You are user #" + Object.values(clients));
    })
// }

app.get('/', (req, res) => res.send('Hello, world!'));

server.listen(port, () => console.log(`Listening on port ${port}`))

/* Handle Connections to React Actions here */
// io.on('connection', (client) => {
//     console.log('User connected')


// })
