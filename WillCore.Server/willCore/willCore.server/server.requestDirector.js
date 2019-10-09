var config = require('./config.json');
var path = require('path');

class requestDirector {
    /**
     * Directs a request to the registered middle-ware.
     * GET requests serves static files.
     * POST requests call server methods.
     * @param {import('http').IncomingMessage} request
     * @param {import('http').ServerResponse} response
     * */
    directRequest(request, response) {
        console.log("============Starting=============");
        console.log(request.url);
        console.log("===============================");
        var methodHandlers = config.server.methodHandlers[request.method];
        if (methodHandlers) {
            for (var handlerIndex in methodHandlers) {
                console.log("===============================");
                console.log(request.url);
                var methodHandler = methodHandlers[handlerIndex];
                var handlerModule = require(methodHandler.module);
                var handlerModuleInstance = new handlerModule();
                var completed = handlerModuleInstance[methodHandler.entryPoint](request, response);
               
                console.log(methodHandler.module);
                console.log(completed);

                if (completed) break;
            }
        }
    }
}

module.exports = requestDirector;