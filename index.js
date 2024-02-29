// library import
const http = require('http');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

// local router import
const userRouter = require("./backend/user/userRouter");
const recipeRouter = require("./backend/recipe/recipeRouter");
const commentRouter = require("./backend/comment/commentRouter");
const savedRouter = require("./backend/saved/savedRouter");


// app 
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/recipe', recipeRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use('/saved', savedRouter);


// server config
const hostname = '127.0.0.1';
const port = 3000;

// create a server
const server = http.createServer(app);

// run a server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});