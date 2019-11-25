let viewProxy = require('./server.viewProxy.js');
let session = require('../session/server.session.js');
let modules = require('./server.endPointContainer.js');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

class viewServer {
    constructor() {
        modules.populate();
    }

    async runMethod(viewName, methodName, methodBody, request, response) {
        try {
            if (!modules.modules[viewName] && !modules.modules["_" + viewName]) return `View ${viewName} not found!`;
            if (!modules.modules[viewName][methodName] && !modules.modules["_" + viewName][methodName]) return `Method ${methodName} on view ${viewName} not found!`;
            await modules.modules[viewName] ? modules.modules[viewName][methodName](methodBody) : modules.modules["_" + viewName][methodName](methodBody);
        } catch (e) {
            console.log("====================================STATIC FILE SERVER ERROR==================================");
            console.log(e);
            console.log("===============================================================================================");
        }
    }
    /**
    * @param {import('http').IncomingMessage} request
    * @param {import('http').ServerResponse} response
    * */
    async runRequest(request, response) {
        var url = request.url;
        var url = url.indexOf("?") > -1 ? url.substring(0, url.indexOf("?")) : url;
        var parts = url.split("/").filter(x => x && x.length > 0);
        if (parts.length != 2) {
            response.writeHead("400");
            response.end("Bad Request");
        } else {
            await this.handleMethod(request, response, parts);
        }
        return true;
    }

    async handleMethod(request, response, parts) {
        var methodBody = await this.processPost(request, response);
        var proxy = new viewProxy(methodBody, request, response);
        this.runMethod(parts[0], parts[1], proxy.proxy, request, response);

    }

    clearProxy(value) {
        if (value._collection) {
            delete value._collection;
        }
        for (var key in value) {
            var childObj = value[key];
            if (typeof childObj === "object") {
                clearProxy(childObj);
            }
        }
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

module.exports = viewServer;