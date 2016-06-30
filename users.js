var _ = require('underscore');

var users = [];

module.exports = {
  list: function(){
    return users;
  },
  add: function(user){
    users.push(user);
  },
  remove: function(userNick){
    users = _.reject(users, function(u){ return u.nick == userNick});
  }
};