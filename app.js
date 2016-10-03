var restify = require('restify');
var fs = require('fs');

const serverName = 'instant-mobile-receiver-api';
const serverPort = 8000;

var server = restify.createServer({
	name: serverName
});

server.listen(serverPort, function() {
	console.log('Server ' + serverName + ' is listening on port ' + serverPort);
});


function respond(req, res, next) {
  res.send({resp: 'hello2'});
  next();
}

server.get('/home', respond);