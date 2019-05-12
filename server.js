// const mongoose = require("mongoose");

const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const PORT = 5000;
const server = http.createServer(app);
const io = require('socket.io')(server);


// const express = require("express");
// const app = express();
// const db = require("./config/keys").mongoURI;
// mongoose
//   .connect(db, { useNewUrlParser: true })
//   .then(() => console.log("Connected to MongoDB successfully"))
//   .catch(err => console.log(err));

/* read the index.html file to host on localhost::5000 */
// app.get("/", function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });


// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.html');
// });

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`))

// const port = process.env.PORT || 5000;
io.on('connection', socket => {
    console.log('User connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})
