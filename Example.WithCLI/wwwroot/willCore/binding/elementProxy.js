import { allBindables, assignable } from "./assignable.js"

var proxyHandler = {
    get: function (target, prop, proxyInstance) {
        if (prop === "element") {
            return target;
        }
        if (allBindables[prop]) {
            target.setFunction(target.target, target.field, allBindables[prop], target.proxyInstance);
            return elementProxy(target, target.setFunction, target.target, target.field, target.proxyInstance);
        } else if (prop in target) {
            return target[prop];
        } else {
            return elementProxy(target, target.setFunction, target.target, target.field, target.proxyInstance);
        }

    }, set: function (target, prop, value) {
        if (!(target instanceof assignable)) {
            if (allBindables[prop]) {
                target.setFunction(target.target, target.field, allBindables[prop], target.proxyInstance);
            } else {
                target.setFunction(target.target, target.field, prop, target.proxyInstance);
            }
        }
        target.setFunction(target.target, target.field, value, target.proxyInstance);
        return true;
    }
};

var elementProxy = function (element, set, target, field, proxyInstance) {
    element.setFunction = set;
    element.target = target;
    element.field = field;
    element.proxyInstance = proxyInstance;

    return new Proxy(element, proxyHandler);
};

export { elementProxy };