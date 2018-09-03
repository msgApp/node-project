var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname+'/public/static.html');
});

io.on('connection', function (socket) {
  console.log('user connect');
  socket.on('chat message', function (msg) {
    console.log('user chat : '+msg);
    io.emit('return message', msg);
  })
})
http.listen(1300,'192.168.0.53', function () {
  console.log('Start Server 192.168.0.53:1300 ');
})
