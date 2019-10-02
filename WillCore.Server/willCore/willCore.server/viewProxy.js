var proxyHandler = {
    set: async function (target, property, value) {
        if (value.then) value = await value;
        if (typeof value === "object") {
            target[property] = new Proxy(value, proxyHandler);
            value._collection = { isModified: true };
        }
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
                if (typeof childObj === "object" && key !== "_collection") {
                    value[key] = new Proxy(childObj, proxyHandler);
                    childObj._collection = value._collection || {};
                    initProxy(childObj);
                }
            }
        }
        initProxy(obj);
    }
}

module.exports = viewProxy;