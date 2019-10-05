var http = require('http');
var requestDirector = require('./server.requestDirector.js');
var config = require('./config.json');
var port = config.server.port || 1337;

/**
 * Main entry point for the willCore server application 
 */
http.createServer(function (request, response) {
    new requestDirector().directRequest(request, response);
}).listen(port);
