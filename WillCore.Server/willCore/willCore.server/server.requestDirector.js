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
    async directRequest(request, response) {
        var methodHandlers = config.server.methodHandlers[request.method];
        if (methodHandlers) {
            for (var handlerIndex in methodHandlers) {
                var beginTime = new Date().getTime();
                let timeout = setTimeout(() => {
                    console.log("=================================LONG RUNNING REQUEST==============================");
                    console.log(`>>>>> ${request.url}`);
                }, 400);
                var methodHandler = methodHandlers[handlerIndex];
                var handlerModule = require(methodHandler.module);
                var handlerModuleInstance = new handlerModule();
                var completed = await handlerModuleInstance[methodHandler.entryPoint](request, response);
                var endTime = new Date().getTime() - beginTime;
                clearTimeout(timeout);
                console.log(endTime);
                console.log(request.url);

                if (endTime > 200) {
                    console.log("=================================LONG RUNNING REQUEST==============================");
                    console.log(`>>>>> ${request.url}`);
                }
                if (completed) break;
            }
        }
    }
}

module.exports = requestDirector;