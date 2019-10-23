let server = {
    getFactoryInstance: () => {
        class server extends willCoreModules.assignable {
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
                let that = this;
                let runRequest = function (requestId) {
                    let requestBody = {};
                    let data = that.collectionsFunc();
                    for (let i = 0; i < data.length; i++) {
                        let collectionObj = {};
                        for (let collectionKey in data[i]) {
                            if (!collectionKey.startsWith("_")) {
                                collectionObj[collectionKey] = data[i][collectionKey];
                            }
                        }
                        requestBody[data[i]._proxyName] = collectionObj;
                    }
                    if (that.sse) {
                        that.sse.close();
                    }
                    createSSE();

                    function createSSE() {
                        that.sse = new EventSource(`/event-stream?id=${requestId}`);
                        that.sse.onerror = (e, b) => {
                            that.sse.close();
                        };
                        that.sse.addEventListener('message', (e) => {
                            const messageData = e.data;
                            if (messageData != "done") {
                                let response = JSON.parse(messageData);
                                for (let key in response) {
                                    that.proxy[key] = response[key];
                                }
                            }
                        });
                    }
                    return server.PostRequest(`${window.location.origin}/${that.proxy._proxyTarget.viewManager.name}/${that.name}`, "PUT", { id: requestId, data: requestBody }, {});
                }
                this.proxy._proxyTarget["_$Sources" + this.name].push(runRequest);
                this.proxy._proxyTarget["_" + this.name] = function () {
                    let promises = [];
                    let requestId = willCoreModules.guid();
                    let sources = that.proxy._proxyTarget["_$Sources" + that.name];
                    for (let i = 0; i < sources.length; i++) {
                        let source = sources[i];
                        let result = source(requestId);
                        promises.push(result);
                    }
                    return promises;
                }
            }

            static runRequest(path, parameters) {
                let url = `${window.location.origin}/${path}`;
                return new Promise((resolve, reject) => {
                    server.PostRequest(url, "POST", { data: parameters }, {}).then(async response => {
                        response = await response.json();
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                });
            }

            static PostRequest(url, method, parameterObj, headers) {
                headers['Content-Type'] = 'application/json';
                let body = null;
                let that = this;
                let query = null;
                for (let key in parameterObj) {
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
                return fetch(url, {
                    method: method,
                    mode: 'cors',
                    body: JSON.stringify(body),
                    headers: new Headers(headers)
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
        return server;
    }
}
export { server };