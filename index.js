var express = require('express');

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

  app.configure(function(){
  app.use('/media', express.static(__dirname + '/media'));
  app.use('/js', express.static(__dirname + '/js'));
  app.use('/css', express.static(__dirname + '/css'));
  });

server.listen(3000);


app.get('/server', function (req, res) {
  res.sendfile(__dirname + '/server.html');
});