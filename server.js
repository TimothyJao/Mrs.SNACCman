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

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('frontend/public'));
        app.get('/', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'frontend', 'public', 'index.html'));
        })
    }

    app.get('/', (req, res) => {
        res.sendFile(path.resolve('../frontend/public/index.html'));
    });

    var roomno = 1;
    io.on('connection', function (socket) {
        console.log('User Connected');
        if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length > 4) roomno++;
        socket.join("room-" + roomno);
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

        /* should return a pojo of all players */
        // socket.on('getPlayers', (player) => {

        // })
        
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

                let message = "You are Mrs.Snaccman! There are " + numClients + " player(s) in your lobby";
                clientSocket.emit('connectToRoom', { message: message, playerNumber: userNum });

            } else {

                let message = "You are a ghost! " + numClients + " player(s) is currently in your lobby";
                clientSocket.emit('connectToRoom', { message: message, playerNumber: userNum });
            }
            userNum++;
        }
    }
// }

app.get('/', (req, res) => res.send('Hello, world!'));

server.listen(port, () => console.log(`Listening on port ${port}`))
