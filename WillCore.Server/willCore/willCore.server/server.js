'use strict';
var http = require('http');
var requestDirector = require('./requestDirector.js');
var config = require('./config.json');
var port = process.env.PORT || 1337;
var session = require('./server.session.js');

http.createServer(function (request, response) {
    var eas = new session(request, response);
    eas.authentication();
    new requestDirector().directRequest(request, response);
}).listen(port);
