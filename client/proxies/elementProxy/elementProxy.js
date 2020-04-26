import { elementProxyHandler } from "./elementProxyHandler.js";
import { assignableProxyHandler } from "/willcore/proxies/base/assignableProxyHandler.js";

/**
 * Proxy class for the main intermediate assignable instanciation.
 */
class elementProxy extends assignableProxyHandler {
    constructor(assignable) {
        super(assignable);
    }
    /**
     * Factory method.
     */
    static new(element) {
        let instance = new Proxy(new elementProxy(), new elementProxyHandler());
        instance._element = element;
        return instance;
    }
}

export { elementProxy };