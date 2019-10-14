var config = require("../../../config.json");
var messageId = 0;
/**
 * Class to handle the workings of a server side event.
 * Author: Philip Schoeman
 * 
 * Handles the timeout expiry of a registered SSE.
 * Handles the result of a SSE.
 * Acts as a modified collection container.
 * */
class activeRequest {
    constructor(id, expireCallback) {
        this.id = id;
        this.timeout = config.sse.requestExpiration;
        this.expireCallback = expireCallback;
        this.timer = setTimeout(() => expireCallback && expireCallback(this), this.timeout);
        this.collections = {};
        this.sseRunCallback = null;
        this.sseResponse = null;
    }

    /**
     * Method to be invoked when a collection is modified or added to a view.
     * @param {string} key
     * @param {object} collection
     */
    setCollection(key, collection) {
        this.collections[key] = collection;
        if (this.sseRunCallback) {
            this.sseRunCallback();
            this.collections = {};
        }
        clearTimeout(this.timer);
        var that = this;
        this.timer = setTimeout(() => that.expireCallback && that.expireCallback(this), this.timeout);
    }

    /**
     * Registers a SSE when a SSE request hits the server.
     * @param {import('http').ServerResponse} response
     */
    registerSSE(response, requestId) {
        var that = this;
        this.sseResponse = response;
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            'Connection': 'keep-alive',
            'transfer-encoding': ''
        });
        this.sseRunCallback = () => {
            var json = JSON.stringify(that.getResultObj(that.collections));
            response.write(`id: ${messageId}\n`);
            messageId++;
            let result = `data: ${json}\n\n`;// ${json}
            response.write(result);
            if (global.activeRequestContainer[requestId].toBeRemoved) {
                delete global.activeRequestContainer[requestId];
                response.end();
                clearTimeout(this.timer);
            }
        };
        if (Object.keys(this.collections).length > 0) {
            this.sseRunCallback();
            this.collections = {};
        }
    }

    getResultObj(value) {
        var result = {};
        for (var key in value) {
            if (key !== "_collection") {
                var childObj = value[key];
                if (typeof childObj === "object" && Array.isArray(childObj) !== true) {
                    childObj = this.getResultObj(childObj);
                } else if (Array.isArray(childObj)) {
                    childObj = childObj.map(x=>this.getResultObj(x));
                }
                result[key] = childObj;
            }
        }
        return result;
    }
}

module.exports = activeRequest;