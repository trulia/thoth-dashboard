var express = require('express');


var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

  app.configure(function(){
  app.use('/media', express.static(__dirname + '/media'));
  app.use('/js', express.static(__dirname + '/js'));
  app.use('/css', express.static(__dirname + '/css'));
  app.use('/img', express.static(__dirname + '/img'));
    app.use('/fonts', express.static(__dirname + '/fonts'));
  });

server.listen(3000);


app.get('/exceptions', function (req, res) {
  res.sendfile(__dirname + '/views/exceptions.html');
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/server.html');
});

app.get('/server', function (req, res) {
  res.sendfile(__dirname + '/views/server.html');
});

app.get('/pool', function (req, res) {
  res.sendfile(__dirname + '/views/pool.html');
});




