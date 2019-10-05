const express = require("express");
const app = express();
const path = require("path");

// app.get("/", (req, res) => {
//   console.log(__dirname);
//   res.sendFile(path.join(__dirname, "../client/index.html"));
// });

app.use(express.static(path.join(__dirname, "../client")));


module.exports = app;
