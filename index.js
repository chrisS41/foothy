// library import
const http = require('http');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const fs = require('fs');
const confFile = fs.readFileSync('config/config.json', 'utf8');
const config = JSON.parse(confFile);

// app 
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/recipe', require("./backend/api/recipe/recipeRouter"));
app.use('/user', require("./backend/api/user/userRouter"));
app.use('/comment', require("./backend/api/comment/commentRouter"));
app.use('/saved', require("./backend/api/saved/savedRouter"));

// for invalid endpoints...
app.use((req, res) => {
  res.status(404).send('not found');
})

// server config
const hostname = config.BE.Host;
const port = config.BE.Port;

// create a server
const server = http.createServer(app);

// run a server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});