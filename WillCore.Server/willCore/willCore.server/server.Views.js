var path = require('path');
var fs = require("fs");
var qs = require('querystring');
var viewProxy = require('./viewProxy.js');

var modules = {
    path: null,
    files: [],
    modules: {}
};

class viewServer {
    constructor() {
        if (!modules.path) {
            modules.path = path.resolve(__dirname, `../../wwwRoot`);
            modules.files = fs.
                readdirSync(modules.path).
                filter(x => path.basename(x).
                    toLowerCase().
                    endsWith(".server.js")).
                map(x => path.resolve("./wwwRoot", x));

            modules.files.forEach(file => {
                var baseName = path.basename(file);
                var moduleName = baseName.substring(0, baseName.indexOf("."));
                modules.modules[moduleName] = modules.modules[moduleName] || {};
                require(file)(modules.modules[moduleName]);
            });
        }
    }

    async runMethod(viewName, methodName, methodBody) {
        if (!modules.modules[viewName]) return `View ${viewName} not found!`;
        if (!modules.modules[viewName][methodName]) return `Method ${methodName} on view ${viewName} not found!`;
        await modules.modules[viewName][methodName](methodBody);
    }
    /**
    * @param {import('http').IncomingMessage} request
    * @param {import('http').ServerResponse} response
    * */
    async runRequest(request, response) {
        var parts = request.url.split("/").filter(x => x && x.length > 0);
        if (parts.length != 2) {
            response.writeHead("400");
            response.end("Bad Request");
        } else {
            var methodBody = await this.processPost(request, response);
            var proxy = new viewProxy(methodBody);
            this.runMethod(parts[0], parts[1], proxy.proxy);
            var result = {};
            for (var collectionKey in proxy.proxy) {
                var collection = proxy.proxy[collectionKey];
                if (collection._collection && collection._collection.isModified) {
                    clearProxy(collection);
                    result[collectionKey] = collection;
                }
            }
            response.writeHead(200, { 'Content-Type': "application/json" });
            response.end(JSON.stringify(result));
        }

        function clearProxy(value) {
            if (value._collection) {
                delete value._collection;
            }
            for (var key in value) {
                var childObj = value[key];
                if (typeof childObj === "object" ) {
                    clearProxy(childObj);
                }
            }
        }
    }

    processPost(request, response) {
        return new Promise((resolve, reject) => {
            request.on('data', function (data) {
                if (data.length > 1e6) {
                    response.writeHead(413, { 'Content-Type': 'text/plain' }).end();
                    request.connection.destroy();
                }
                resolve(JSON.parse(data));
            });
        });
    }
}

module.exports = new viewServer();