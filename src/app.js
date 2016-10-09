"use strict";

var restify = require('restify')
	, restifyOAuth2 = require('restify-oauth2')
	, hooks = require('./authentication/hooks')
	, fs = require('fs')
	, config = require('config')
    , AWS = require('aws-sdk');

var server = restify.createServer({
	name: config.server.name,
  version: require("../package.json").version,
  key: fs.readFileSync(__dirname + '/../server-key.pem'),
  certificate: fs.readFileSync(__dirname + '/../server-cert.pem'),
  formatters: {
    "application/hal+json": function (req, res, body, cb) {
      return res.formatters["application/json"](req, res, body, cb);
    }
  }
});

AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.region,
    endpoint: config.AWS.endpoint
});

var RESOURCES = Object.freeze({
    INITIAL: "/",
    TOKEN: "/user/login",
    PUBLIC: "/public",
    SECRET: "/secret"
});

server.use(restify.authorizationParser());
server.use(restify.bodyParser());
restifyOAuth2.ropc(server, { tokenEndpoint: RESOURCES.TOKEN, hooks: hooks });


server.get(RESOURCES.SECRET, function (req, res) {
    if (!req.username) {
        return res.sendUnauthenticated();
    }
    var response = {
        "users with a token": "have access to this secret data",
        _links: {
            self: { href: RESOURCES.SECRET },
            parent: { href: RESOURCES.INITIAL }
        }
    };

    res.contentType = "application/hal+json";
    res.send(response);
});

server.post('/close', function(req, res){
    res.send(200);
    server.close();
});








server.listen(config.server.port, function() {
	console.log('Server ' + config.server.name + ' is listening on port ' + config.server.port);
});

// initialize routes
require('./routes')(server);