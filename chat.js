var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

var active = [];// list of active usernames
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('chat_message', function (msg) {
    io.emit('chat_message', msg);
    console.log(msg)
  });
});

//every connection
io.on('connection', (socket) => {
  console.log('New user connected')


  //default username
  socket.username = "Anonymous"


  //change username
  socket.on('change_username', (data) => {
    active.push(data.username)
    socket.username = data.username;
    console.log(data.username);
    io.sockets.emit('change_username', { username: data.username, users: active });

  })

  //new message
  socket.on('new_message', (data) => {
    //broadcasting the new message
    io.sockets.emit('new_message', { message: data.message, username: socket.username });
  })

  //typing
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: socket.username })
  })

  socket.on('add user', (username) => {
    if (addedUser) return;

  });

  // socket.on('disconnect', function() {
  //     console.log('user disconnected')
  //   });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});