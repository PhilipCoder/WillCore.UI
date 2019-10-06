var activeRequest = require("./activeRequest/activeRequest.js");
var config = require('../../config.json');
global.activeRequestContainer = {};
/**
 * Interface to the SSE request container. 
 * Author: Philip Schoeman
 * 
 * How SSE works:
 * 
 * 1. An assignable with a function that returns an array of dependent collections is used to create the server collection source.
 * 2. When the collection source is fired, a random GUID is generated (the request ID).
 * 3. A PUT request is fired with the with the request ID as parameter and the dependent collections as body.
 * 4. The same time a SSE request is fired, also with the request ID as parameter.
 * 5. A global SSE event container based on a proxy should be present. This request container is keyed by the request IDs.
 * 6. When a collection is modified, the server-side view proxy adds the modified collection to the SSE event container. The event container proxy will then check if any SSE promises are registered on the container, if there are any, they will be resolved with the modified collections.
 * 7. When the SSE hits the server, it will register itself on the event-container. This registration is a promise that when resolved, will return the SSE with JSON of the modified collections for the request.
 * 8. When the promise is registered, the SSE event proxy will do the same check to see if there are modified collections and will resolve the SSE promise if any modified collections are detected.
 * 9. A SSE timeout should be specified in the config JSON. A timeout should be registered for the SSE that will reject the SSE promise.
 * */
class sseContainer {
    constructor() {
    }

    /**
     * Memory management function. Removes a request from the container on expiration.
     * @static
     * @param {any} request
     */
    static requestExpiration(request) {
        delete global.activeRequestContainer[request.id];
    }

    /**
     * Adds a collection to the SSE container.
     * 
     * @static
     * @param {string} requestId
     * @param {string} collectionKey
     * @param {object} collection
     */
    static setCollectionModified(requestId, collectionKey, collection) {
        global.activeRequestContainer[requestId] = global.activeRequestContainer[requestId] || new activeRequest(requestId, this.requestExpiration);
        global.activeRequestContainer[requestId].setCollection(collectionKey, collection);
    }

    /**
     * Registers a request on the SSE container
     * @param {number} requestId
     */
    static registerRequest(requestId) {
        global.activeRequestContainer[requestId] = global.activeRequestContainer[requestId] || new activeRequest(requestId, this.requestExpiration);
    }

	/**
	 * Middleware entry point.
     * Registers a SSE request on the request container.
    * @param {import('http').IncomingMessage} request
    * @param {import('http').ServerResponse} response
	 */
    registerSSE(request, response) {
        if (request.url.startsWith("/event-stream")) {
            var requestId = request.url.substring(request.url.indexOf("=") + 1);
            global.activeRequestContainer[requestId] = global.activeRequestContainer[requestId] || new activeRequest(requestId, this.requestExpiration);
            global.activeRequestContainer[requestId].registerSSE(response);
            //stop the middleware processing
            return true;
        }
        //continue middleware processing
        return false;
    }

	/**
	 * Finalizes and closes the SSE request.
	 * @param {number} requestId
	 */
    static unloadSSE(requestId) {
        if (global.activeRequestContainer[requestId]) {
            global.activeRequestContainer[requestId].sseResponse.write(`data: done\n\n`);
            global.activeRequestContainer[requestId].sseResponse.end();
            delete global.activeRequestContainer[requestId];
        }
    }
}

module.exports = sseContainer;