import { assignable } from "../binding/assignable.js";
import { guid } from "../helpers/guid.js";

class server extends assignable {
    constructor() {
        super({ function: 1 });
        this.target = null;
        this.source = null;
        this.originalValue = null;
        super.topInstance = this;
        this.deleteFromProxy = true;
        this.baseObj = null;
        this.sse = null;
    }

    setValues(values) {
        this.collectionsFunc = values.function[0];
        this.proxy._proxyTarget["_$Sources" + this.name] = this.proxy._proxyTarget["_$Sources" + this.name] || [];
        var that = this;
        var runRequest = function (requestId) {
            var requestBody = {};
            var data = that.collectionsFunc();
            for (var i = 0; i < data.length; i++) {
                var collectionObj = {};
                for (var collectionKey in data[i]) {
                    if (!collectionKey.startsWith("_")) {
                        collectionObj[collectionKey] = data[i][collectionKey];
                    }
                }
                requestBody[data[i]._proxyName] = collectionObj;
            }
         
            that.PostRequest(`${window.location.origin}/${that.proxy._proxyTarget.viewManager.name}/${that.name}`, "PUT", { id: requestId, data: requestBody }, {});
            if (that.sse) {
                that.sse.close();
            }
            createSSE();
            function createSSE() {
                that.sse = new EventSource(`/event-stream?id=${requestId}`);
                that.sse.onerror = (e,b) => {
                     that.sse.close();
                };
                that.sse.addEventListener('message', (e) => {
                    const messageData = e.data;
                    if (messageData != "done") {
                        let response = JSON.parse(messageData);
                        for (var key in response) {
                            that.proxy[key] = response[key];
                        }
                    }
                });
            }
           
        }
        this.proxy._proxyTarget["_$Sources" + this.name].push(runRequest);
        this.proxy._proxyTarget["_" + this.name] = function () {
            var requestId = guid();
            var sources = that.proxy._proxyTarget["_$Sources" + that.name];
            for (var i = 0; i < sources.length; i++) {
                var source = sources[i];
                var result = source(requestId);
                if (typeof result !== "undefined" && result !== null) {
                    //this.proxy[this.name] = result;
                }
            }
        }
        console.log(this.proxy._proxyTarget);

    }

    PostRequest(url, method, parameterObj, headers) {
        headers['Content-Type'] = 'application/json';
        var body = null;
        var that = this;
        var query = null;
        for (var key in parameterObj) {
            if (typeof parameterObj[key] === "object") {
                body = body || {};
                body = parameterObj[key];
            } else {
                query = query || {};
                query[key] = parameterObj[key];
            }
        }
        if (query) {
            url = new URL(url);
            url.search = new URLSearchParams(query);
        }
        fetch(url, {
            method: method,
            mode: 'cors',
            body: JSON.stringify(body),
            headers: new Headers(headers)
        }).then((data) => {
            //that.sse.close();
        });
    }

    setTarget(target, source) {
        this.target = target;
        this.source = source;
    }

    static assignAbleToNonElement() {
        return true;
    }
};

assignable.registerBindable("server", server);

export { server };