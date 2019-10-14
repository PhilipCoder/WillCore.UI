var authentication = require('../session/server.session.js');
var sseContainer = require('./server.sseContainer.js');

var proxyHandler = {
    set: async function (target, property, value) {
        if (value.then) value = await value;
        if (typeof value === "object") {
            target[property] = Array.isArray(value) ? value: new Proxy(value, proxyHandler);
            value._collection = target._collection || { isModified: true, collectionName: property, container: target };
            sseContainer.setCollectionModified(target.requestId, property, target[property]);
        } 
        else {
            target[property] = value;
        }
        if (target._collection) {
            target._collection.isModified = true;
            sseContainer.setCollectionModified(target._collection.container.requestId, target._collection.collectionName, target._collection.container[target._collection.collectionName]);
        }
        return true;
    },
    get: function (target, property) {
        return target[property];
    }
};

/**
 * Server-Side collections container.
 * Acts as a state observable to registers modified collections in the SSE container.
 * 
 * Author : Philip Schoeman
 * */
class viewProxy {
    constructor(obj, request, repsonse) {
        obj.requestId = request.url.substring(request.url.indexOf("=") + 1);
        sseContainer.registerRequest(obj.requestId);
        obj.session = new authentication(request, repsonse);
        obj.repsonse = repsonse;
        obj.done = function () {
            var result = { success: true };
            obj.repsonse.writeHead(200, { 'Content-Type': "application/json", 'Cache-Control': 'private, no-cache, no-store, must-revalidate' });
            obj.repsonse.end(JSON.stringify(result));
            sseContainer.unloadSSE(obj.requestId);
        };
        this.proxy = new Proxy(obj, proxyHandler);
        function initProxy(value) {
            for (var key in value) {
                var childObj = value[key];
                if (typeof childObj === "object" && key !== "_collection" && key !== "session" && key !== "repsonse" ) {
                    value[key] = new Proxy(childObj, proxyHandler);
                    childObj._collection = value._collection || { collectionName: key, container: obj };
                    initProxy(childObj);
                }
            }
        }
        initProxy(obj);

    }
}

module.exports = viewProxy;