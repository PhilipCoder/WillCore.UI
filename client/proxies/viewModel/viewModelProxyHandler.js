import { assignableProxyHandler } from "/willcore/proxies/base/assignableProxyHandler.js";
import { elementProxy } from "../elementProxy/elementProxy.js"
import { dataSetProxyFactory } from "../../binding/dataSetProxy.js";

class viewModelProxyHandler extends assignableProxyHandler {
    constructor() {
        super(null);
        this.getTraps.unshift(this.getElementProxy);
        this.setTraps.unshift(this.setDataSetProxy);

    }

    getElementProxy(target, property, proxy) {
        if (property.startsWith("$")) {
            property = property.substring(1);
            let elementId = `${proxy._viewId}.${property}`;
            let element = document.getElementById(elementId);
            if (elementId) {
                target[property] = elementProxy.new(element);
                return { value: target[property], status: true }
            }
        }
        return { value: false, status: false }
    }

    setDataSetProxy(target, property, value, proxy) {
        if (!property.startsWith("$") && typeof value === "object") {
            target[property] = dataSetProxyFactory(value);
            return { value: target[property], status: true }
        }
        return { value: false, status: false }
    }
}

export { viewModelProxyHandler };