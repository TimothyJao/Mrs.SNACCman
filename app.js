const mongoose = require("mongoose");


var app = require('express')(); 
var http = require('http').createServer(app);

// const express = require("express");
// const app = express();
// const db = require("./config/keys").mongoURI;
// mongoose
//   .connect(db, { useNewUrlParser: true })
//   .then(() => console.log("Connected to MongoDB successfully"))
//   .catch(err => console.log(err));

/* read the index.html file to host on localhost::5000 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));
