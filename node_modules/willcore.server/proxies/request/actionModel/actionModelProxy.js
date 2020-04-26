const actionModelProxyHandler = require("./actionModelProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class actionModelProxy extends baseProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<requestProxyHandler>}
     */
    static new(sourceObj) {
        let proxy = new actionModelProxy();
        if (sourceObj) {
            if (sourceObj.parameters && typeof sourceObj.parameters === "object") {
                Object.keys(sourceObj.parameters).filter(k => !k.startsWith("_")).forEach(key => {
                    proxy[key] = sourceObj.parameters[key];
                });
            }
            if (sourceObj.restParameters && typeof sourceObj.restParameters === "object") {
                Object.keys(sourceObj.restParameters).filter(k => !k.startsWith("_")).forEach(key => {
                    proxy[key] = sourceObj.restParameters[key];
                });
            }
            if (sourceObj.body && typeof sourceObj.body === "object") {
                Object.keys(sourceObj.body).filter(k => !k.startsWith("_")).forEach(key => {
                    proxy[key] = sourceObj.body[key];
                });
            }
        }
        let result = new Proxy(proxy, new actionModelProxyHandler(sourceObj));
        return result;
    }
}

module.exports = actionModelProxy;