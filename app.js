const mongoose = require("mongoose");

const express = require("express");
const app = express();
// const db = require("./config/keys").mongoURI;
// mongoose
//   .connect(db, { useNewUrlParser: true })
//   .then(() => console.log("Connected to MongoDB successfully"))
//   .catch(err => console.log(err));

// app.get("/", (req, res) => res.send("Mrs.SnaccMan coming to you soon!"));
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is running on port ${port}`));