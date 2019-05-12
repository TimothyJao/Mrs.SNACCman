const mongoose = require("mongoose");


var app = require('express')(); 
var http = require('http').createServer(app);

// const express = require("express");
// const app = express();
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

  
app.get("/", (req, res) => res.send("Mrs.SnaccMan coming to you soon!"));
const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Server is running on port ${port}`));
