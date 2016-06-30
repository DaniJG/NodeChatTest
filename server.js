// server.js
// where your node app starts

// init project
var http = require('http');
var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser');

var usersRouter = require('./usersController');
var chat = require('./chat');

//Initialize express and socket.io
var app = express();
var server = http.Server(app);
var io = socket(server);

//helper middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

//api routers
app.use('/api/users', usersRouter);

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
server.listen(process.env.PORT, function(){
  console.log('listening on *:3000');
});

//listen for web socket events
chat.start(io);