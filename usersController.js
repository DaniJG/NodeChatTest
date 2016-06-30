var express = require('express');
var users = require('./users');

var usersRouter = express.Router();

usersRouter.get("/", function(req,res){
    res.send(users.list());
});

usersRouter.post("/join", function(req,res){
  var newUser = req.body;
  if(!newUser.nick) return res.sendStatus(400);
  
  users.add(newUser);
  res.sendStatus(201);
});

module.exports = usersRouter;