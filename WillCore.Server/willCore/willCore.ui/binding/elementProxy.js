let proxyHandler = {
    get: function (target, prop, proxyInstance) {
        if (prop === "element") {
            return target;
        }
        if (willCoreModules.baseInhertants.assignable[prop]) {
            target.setFunction(target._target, target.field, willCoreModules.baseInhertants.assignable[prop], target.proxyInstance);
            return elementProxy(target, target.setFunction, target._target, target.field, target.proxyInstance);
        } else if (prop in target) {
            return target[prop];
        } else if (prop.startsWith && prop.startsWith("$")) {
            target.tmpId = prop.replace("$", "");
            return elementProxy(target, target.setFunction, target._target, target.field, target.proxyInstance);
        }
        else {
            return elementProxy(target, target.setFunction, target._target, target.field, target.proxyInstance);
        }

    }, set: function (target, prop, value) {
        if (!(target instanceof willCoreModules.assignable)) {
            if (willCoreModules.baseInhertants.assignable[prop]) {
                target.setFunction(target._target, target.field, willCoreModules.baseInhertants.assignable[prop], target.proxyInstance);
            } else {
                target.setFunction(target._target, target.field, prop, target.proxyInstance);
            }
        }
        target.setFunction(target._target, target.field, value, target.proxyInstance);
        return true;
    }
};

let elementProxy = function (element, set, target, field, proxyInstance) {
    element.setFunction = set;
    element._target = target;
    element.field = field;
    element.proxyInstance = proxyInstance;

    return new Proxy(element, proxyHandler);
};

export { elementProxy };