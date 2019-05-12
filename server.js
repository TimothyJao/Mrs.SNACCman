// const mongoose = require("mongoose");

const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


// const express = require("express");
// const app = express();
// const db = require("./config/keys").mongoURI;
// mongoose
//   .connect(db, { useNewUrlParser: true })
//   .then(() => console.log("Connected to MongoDB successfully"))
//   .catch(err => console.log(err));

/*  generateRandomId- random id generated to join a lobby */
function generateRandomId(len) {
    let result = "";
    for (let i = 0; i < len; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}


//TODO: read the react component
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});


server.listen(port, () => console.log(`Listening on port ${PORT}`))

/* Handle Connections to React Actions here */
io.on('connection', (client) => {
    console.log('User connected')

    client.on('disconnect', () => {
        console.log('user disconnected')
    })
})
