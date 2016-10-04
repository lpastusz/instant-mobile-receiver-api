"use strict";

var restify = require('restify')
	, fs = require('fs')
	, config = require('config')


var server = restify.createServer({
	name: config.server.name
});

server.listen(config.server.name, function() {
	console.log('Server ' + config.server.name + ' is listening on port ' + config.server.port);
});


function respond(req, res, next) {
  	res.send({resp: 'hello2'});
  	next();
}

server.get('/home', respond);