let request = {
    getFactoryInstance: () => {
        class request extends willCoreModules.assignable {
            constructor() {
                super({ string: 2, object: 2 });
                this.url = "";
                this.name = "";
                this.proxy = null;
                super.topInstance = this;
                this.deleteFromProxy = false;
                this.deleteCollection = true;
            }

            setValues(values) {
                let firstString = values.string[0];
                let secondString = values.string[1];

                this.parameters = values.object[0];
                this.headers = values.object[1];
                this.url = firstString != "GET" && firstString != "POST" && firstString != "DELETE" && firstString != "PUT" && firstString != "PATCH" ? firstString : secondString;
                this.verb = firstString != "GET" && firstString != "POST" && firstString != "DELETE" && firstString != "PUT" && firstString != "PATCH" ? secondString : firstString;

                function getParameters(parameters) {
                    let parameterObj = {};
                    for (var paramName in parameters) {
                        var currentParameter = parameters[paramName];
                        if (typeof (currentParameter) == "function") {
                            currentParameter = currentParameter();
                        } else if (typeof currentParameter === "object") {
                            currentParameter = getParameters(currentParameter);
                        }
                        parameterObj[paramName] = currentParameter;
                    }
                    return parameterObj;
                }
                var parameterObj = getParameters(this.parameters);

                var tokenObj = {};
                for (var tokenName in this.headers) {
                    var currentToken = this.headers[tokenName];
                    if (typeof (currentToken) == "function") {
                        currentToken = currentToken();
                    }
                    tokenObj[tokenName] = currentToken;
                }
                delete this.proxy[this.name];
                this.proxy[this.name] = new Promise((resolve, reject) => {
                    var promiseCall = this.verb == "POST" || this.verb == "PUT" || this.verb == "PATCH" ?
                        this.PostRequest(this.url, this.verb, parameterObj, tokenObj) :
                        this.GetRequest(this.url, this.verb, parameterObj, tokenObj);

                    promiseCall.then(async response => {
                        response = await response.json();
                        this.proxy[this.name] = response;
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                });
            }

            PostRequest(url, method, parameterObj, headers) {
                headers['Content-Type'] = 'application/json';
                let body = null;
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
                })
            }

            GetRequest(url, method, parameters, headers) {
                headers['Content-Type'] = 'application/json';
                url = new URL(url);
                url.search = new URLSearchParams(parameters)
                return fetch(url, {
                    method: method,
                    mode: 'cors',
                    headers: new Headers(headers)
                });
            }

            static assignAbleToNonElement() {
                return true;
            }
        };

        return request;
    }
}
export { request };