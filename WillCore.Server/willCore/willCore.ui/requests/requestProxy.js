//let result = await view.server.login.authenticate({userName:"drPhil"});
const methodProxyHandler = {
    get: function (target, property) {
        return function (requestParameters) {
            return willCoreModules.server.runRequest(`${target.view}/${property}`, requestParameters);
        }
    }
};

const viewRequestHandler = {
    get: function (target, property) {
        if (property === "skipIndexing") {
            return true;
        }
        if (property === "view") {
            return target[property];
        } else {
            let destObj = { view: property };
            return new Proxy(destObj, methodProxyHandler);
        }
    }
};

let viewDestObj = {};
let requestProxy = new Proxy(viewDestObj, viewRequestHandler);

export { requestProxy };