'use strict';
var http = require('http');
var requestDirector = require('./requestDirector.js');
var config = require('./config.json');
var port = process.env.PORT || 1337;

http.createServer(function (request, response) {
    new requestDirector().directRequest(request, response);
}).listen(port);
