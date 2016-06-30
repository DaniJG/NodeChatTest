var users = require('./users');
var usersMap = {};

var chat = {
  
  connected: function(socket, io){
    console.log(`user connected. Id:${socket.id}`);
    
    socket.on('join', function(user){
      chat.join(socket, io, user);
    });
    
    socket.on('message', function(message){
      chat.message(socket, io, message);
    });
    
    socket.on('disconnect', function(){
      chat.disconnect(socket);  
    });
  },
  
  join: function(socket, io, user){
    console.log(`user ${socket.id} joined as ${user.nick}`);
    usersMap[socket.id] = user.nick;
    
    //broadcast to everyone including current connection
    io.emit('user-joined', user.nick);
  },
  
  message: function(socket, io, message){
    var userNick = usersMap[socket.id];
    if(!userNick) return;
    
    console.log(`${userNick} says ${message}`);
    //broadcast to everyone including current connection
    io.emit('message', {nick: userNick, message: message});
  },
  
  disconnect: function(socket){
    console.log(`user disconnected. Id:${socket.id}`);
    var userNick = usersMap[socket.id];
    if(!userNick) return;
    
    //broadcast to everyone except current connection
    socket.broadcast.emit('user-left', userNick);
    users.remove(userNick);
  }
}

module.exports = {
  start: function(io){
    io.on('connection', function(socket){
      chat.connected(socket, io)
    });
  }
};