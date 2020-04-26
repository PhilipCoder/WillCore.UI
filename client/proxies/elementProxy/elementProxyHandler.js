import { assignableProxyHandler } from "/willcore/proxies/base/assignableProxyHandler.js";

class elementProxyHandler extends assignableProxyHandler {
    constructor() {
        super(null);
       // this.getTraps.unshift(this.getElementProxy);
    }

    getElementProxy(target, property, proxy){
        throw "Not Implemented";
    }
}

export { elementProxyHandler };