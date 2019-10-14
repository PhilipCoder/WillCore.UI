let session = require('../session/server.session.js');
let modules = require('./server.endPointContainer.js');

class simpleRequests {
    constructor() {
        modules.populate();
    }

    async runMethod(viewName, methodName, methodBody, request, response) {
        if (!modules.modules[viewName] && !modules.modules["_" + viewName]) return `View ${viewName} not found!`;
        if (!modules.modules[viewName][methodName] && !modules.modules["_" + viewName][methodName]) return `Method ${methodName} on view ${viewName} not found!`;
        var result = await (modules.modules[viewName] ? modules.modules[viewName][methodName](methodBody) : modules.modules["_" + viewName][methodName](methodBody));
        response.writeHead(200, { 'Content-Type': "application/json", 'Cache-Control': 'private, no-cache, no-store, must-revalidate' });
        response.end(JSON.stringify(result));
    }
    /**
    * @param {import('http').IncomingMessage} request
    * @param {import('http').ServerResponse} response
    * */
    runRequest(request, response) {
        var url = request.url;
        var parts = url.split("/").filter(x => x && x.length > 0);
        if (parts.length != 2) {
            response.writeHead("400");
            response.end("Bad Request");
        } else {
            this.handleMethod(request, response, parts);
        }
        return true;
    }

    async handleMethod(request, response, parts) {
        return new Promise(async (resolve, reject) => {
            var methodBody = await this.processPost(request, response);
            this.runMethod(parts[0], parts[1], methodBody, request, response);
            resolve();
        });
    }

    processPost(request, response) {
        return new Promise((resolve, reject) => {
            request.on('data', function (data) {
                if (data.length > 1e6) {
                    response.writeHead(413, { 'Content-Type': 'text/plain', 'Cache-Control': 'private, no-cache, no-store, must-revalidate' }).end();
                    request.connection.destroy();
                }
                resolve(JSON.parse(data));
            });
        });
    }
}

module.exports = simpleRequests;