var config = require('./config.json');
var staticFileServer = require('./server.static.js');
var path = require('path');


class requestDirector {
    /**
     * Directs a request to either static file serving or server collection sources.
     * GET requests serves static files.
     * POST requests call server methods.
     * @param {import('http').IncomingMessage} request
     * @param {import('http').ServerResponse} response
     * */
    directRequest(request, response) {
        if (request.method == "GET") {
            var fileExtenstion = path.extname(request.url);
            if (!fileExtenstion) {
                response.writeHead("404");
                response.end("File not found.");
                return;
            }
            var fileServer = new staticFileServer();
            var fileURL = fileServer.getFileLocation(request.url);
            if (fileServer.getFileExcluded(request.url)) {
                response.writeHead("401");
                response.end("File not available for access.");
                return;
            }
            var result = fileServer.serveFile(fileURL);
            response.writeHead(fileServer.responseCode, { 'Content-Type': fileServer.mimeType });
            response.end(result);
        } else if (request.method == "POST") {
            var viewServer = require('./server.views.js');
        } else {
            throw `Invalid request method ${request.method}`;
        }
    }

   
}

module.exports = requestDirector;