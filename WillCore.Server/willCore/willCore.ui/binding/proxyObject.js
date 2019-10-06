import { execptionHander } from "../helpers/exceptionHander.js";

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function subProxyObj(obj, update, validateFunc, viewManager) {
    var isArray = Array.isArray(obj);

    Object.keys(obj).forEach(function (property) {
        if (Array.isArray(obj[property])) {
            obj[property]._proxyName = obj._proxyName;
            obj[property] = emulateArray(obj[property], update, validateFunc, viewManager);
        } else if (isObject(obj[property])) {
            obj[property]._proxyName = obj._proxyName;
            obj[property] = proxyObject(obj[property], update, validateFunc, viewManager);
        }
    });
}

function setUpdateValue(target, property, value, update, validateFunc, viewManager, receiver) {
    var oldValue = target[property];

    if (Array.isArray(value)) {
        target[property] = emulateArray(value, update, validateFunc, viewManager);
    } else if (isObject(value)) {
        value._proxyName = target._proxyName;
        target[property] = proxyObject(value, update, validateFunc, viewManager);
    } else {
        target[property] = value;
    }
    if (typeof (target) == "object" && target.length !== undefined && value && value.Id) {

    } else {

        update(receiver, property, receiver[property], viewManager, oldValue);
    }
}

function updateValue(target, property, value, update, validateFunc, viewManager, receiver) {
    var canUpdate = true;
    if (target.trap) {
        canUpdate = target.trap(property, value, target[property], receiver);
    }
    if (canUpdate)
        setUpdateValue(target, property, value, update, validateFunc, viewManager, receiver);
}

function emulateArray(obj, update, validateFunc, viewManager) {
    var length = obj.length || 0;
    obj._isProxy = true;
    subProxyObj(obj, update, validateFunc, viewManager);
    return new Proxy(obj, {
        get: function (target, property, receiver) {
            validateFunc(target, property, viewManager, receiver);
            if (property === 'length') {
                return length;
            }

            if (property in target) {

                return target[property];
            }

            if (property in Array.prototype) {
                execptionHander.handleExeception("Immutable Object", `Unable to change the array. All array collections are immutable.`);
            }
        },
        set: function (target, property, value, receiver) {
            if (property === 'length') {
                execptionHander.handleExeception("Immutable Object", `Unable to change the array. All array collections are immutable.`);
                return true;
            } else {
            }
            updateValue(target, property, value, update, validateFunc, viewManager, receiver);


            if (Number(property) >= length) {
                execptionHander.handleExeception("Immutable Object", `Unable to change the array. All array collections are immutable.`);
            }

            return true;
        },
        deleteProperty(target, property) {
            if (property in target) {
                var oldValue = target[property];
                target[property] = undefined;
                update(undefined, viewManager, oldValue);
            }

            return true;
        }
    });
}

function proxyObject(obj, update, validateFunc, viewManager) {
    if (typeof (obj) == "object" && !Array.isArray(obj) && obj._isProxy && !obj._proxyTarget) {
        obj = Object.assign({}, obj);
    }
    subProxyObj(obj, update, validateFunc, viewManager);
    obj._isProxy = true;
    function handler(validateFunc) {
        this.validateFunc = validateFunc;

    }
    handler.prototype.get = function (target, property, receiver) {
        if (property == "_proxyTarget") {
            return target;
        }
        try {
            validateFunc(target, property, viewManager, receiver);
        } catch (e) {
            console.log(e);
        }
        return target[property];
    };

    handler.prototype.set = function (target, property, value, receiver) {
     
        updateValue(target, property, value,update, validateFunc, viewManager, receiver);
        return true;
    }

    handler.prototype.deleteProperty = function (target, property) {
        if (property in target) {
            update( undefined, true, viewManager, target[property]);
            delete target[property];
        }

        return true;
    }


    return new Proxy(obj, new handler(validateFunc));
}

export { proxyObject }
