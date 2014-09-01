var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Orientation = require('../www/scripts/orientation');
var _ = require("underscore");

var avatars = {};

app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname + '/../www/'});
});

app.use('/styles/', express.static(__dirname + '/../www/styles'));
app.use('/bundle.js', express.static(__dirname + '/../www/bundle.js'));
app.use('/assets/', express.static(__dirname + '/../www/assets'));

io.on('connection', function(socket){
  console.log('a user connected');
  var id = socket.id;
  var avatar = {
        id: id,
        x: 8,
        dx: 0,
        max_speed: 14
    };
  avatars[avatar.id] = avatar;
  socket.emit('avatar load', {id: id, avatars: avatars});
  io.emit('player join', avatar);
  socket.on('avatar move', function(data) {
    var direction = data.direction;
    var timestamp = data.timestamp;
    var dt = (Date.now() - timestamp) / 1000;
    avatar.dx = avatar.max_speed;
    if (direction === Orientation.Left)
        avatar.dx *= -1;
    //avatar.x += avatar.dx * dt;
    io.emit('avatar move', {id: id, direction: direction});
  });
  socket.on('avatar stop', function(data) {
    var timestamp = data.timestamp;
    var dt = (Date.now() - timestamp) / 1000;
    //avatar.x -= avatar.dx * dt;
    avatar.dx = 0;
    io.emit('avatar stop', {id: id});
  });
  socket.on('disconnect', function(socket){
    console.log('user disconnected');
    io.emit('player leave', id);
    delete avatars[id];
  });
});

(function update(lastTime) {
    var currentTime = Date.now() / 1000;
    var dt = currentTime - lastTime;
    _.each(avatars, function(avatar) {
        avatar.x += avatar.dx * dt;
    });
    setTimeout(update, 10, currentTime);
})(Date.now()/1000);

(function net_update(lastTime) {
    var currentTime = Date.now() / 1000;
    io.emit('avatar update', avatars);
    setTimeout(net_update, 1000, currentTime);
})(Date.now()/1000);

http.listen(4000, function(){
  console.log('listening on *:4000');
});