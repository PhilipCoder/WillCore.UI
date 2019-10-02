var proxyHandler = {
    set: function (target, property, value) {
        target[property] = value;
        if (target._collection) {
            target._collection.isModified = true;
        }
        return true;
    },
    get: function (target, property) {
        return target[property];
    }
};

class viewProxy {
    constructor(obj) {
        this.proxy = new Proxy(obj, proxyHandler);
        function initProxy(value) {
            for (var key in value) {
                var childObj = value[key];
                if (typeof childObj === "object") {
                    childObj._collection = value._collection || childObj;
                    value[key] = new Proxy(childObj, proxyHandler);
                    initProxy(childObj);
                }
            }
        }
        initProxy(obj);
    }
}