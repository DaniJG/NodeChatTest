// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('hello world :o');

  var currentUser = null;
  var socket = io();
  
  socket.on('user-joined', function(nick){
    addMessage(nick, ' joined!');

    $('<li></li>').text(nick + (isCurrentUser(nick) ? " - YOU!" : "")).appendTo('#users');
  });
  
  socket.on('user-left', function(nick){
    addMessage(nick, ' left :(');
  });
  
  socket.on('message', function(data){
    addMessage(data.nick, data.message);
  });
  
  function isCurrentUser(nick){
    return !!currentUser && nick == currentUser.nick;
  }
  
  function addMessage(nick, message){
    if(!isCurrentUser(nick)) message = `${nick}> ${message}`;
    
    $('<li></li>').text(message).appendTo('#messages');
  }

  $('#join form').submit(function(event) {
    event.preventDefault();
    
    currentUser = {nick: $('input#nick').val() };
    
    $.ajax('/api/users/join', {
      data : JSON.stringify(currentUser),
      contentType : 'application/json',
      type : 'POST',
      success: function(){
        $('input#nick').val('');
        $('#nick-name').text(currentUser.nick);
        
        socket.emit('join', currentUser);
        $('#join').hide();
        $('#public-chat').show();
      }
    });
    
  });

  $('#public-chat form').submit(function(event) {
    event.preventDefault();
    
    var message = $('input#message').val();
    socket.emit('message', message);
    $('input#message').val('');
  });

  $.get('/api/users', function(users) {
    users.forEach(function(user) {
      $('<li></li>').text(user.nick).appendTo('ul#users');
    });
  });
  
});
