import { proxyObject } from "./proxyObject.js";
import { assignable } from "./assignable.js";
class collectionManager {
    constructor() {
        this.collections = {};
        this.originalHTMLBindings = new Map();
        this.unbindedHTMLBindings = new Map();
        this.dynamicHTMLBindings = new WeakMap();
        this.bindableBindings = new WeakMap();
        this.currentBindable = null;
        this.targetValue = null;
    };

    deleteObject(curObj, moveToUnbinded, collectionManagerInstance) {
        if (curObj instanceof assignable) return;
        if (moveToUnbinded) {
            var nodes = collectionManagerInstance.originalHTMLBindings.get(curObj);
            if (nodes && nodes.values) {
                var values = Array.from(nodes.values());
                if (values.length > 0) {
                    for (var valueCollectionIndex = 0; valueCollectionIndex < values.length; valueCollectionIndex++) {
                        values[valueCollectionIndex].forEach(x => {
                            collectionManagerInstance.unbindedHTMLBindings.set(x, true);
                        });
                    }
                }
            }
        }
        collectionManagerInstance.originalHTMLBindings.delete(curObj);
        if (typeof (curObj) == "object" && curObj !== null && curObj._isProxy && !curObj.then) {
            for (var key in curObj) {
                if (typeof curObj[key] === "object") {
                    collectionManagerInstance.deleteObject(curObj[key], moveToUnbinded, collectionManagerInstance);
                }
            }
        }
    };

    clear(proxy) {
        for (var keyToRemove in this.collections) {
            if (!proxy[keyToRemove]._skipCleanup)
                delete proxy[keyToRemove];
        }
        this.collections = {};
        this.originalHTMLBindings = new Map();
        this.unbindedHTMLBindings = new Map();
        this.dynamicHTMLBindings = new WeakMap();
        this.bindableBindings = new WeakMap();
        this.currentBindable = null;
        this.targetValue = null;
        for (var key in proxy) {
            if (key.startsWith("_$Sources") || key.startsWith("_$targets")) {
                proxy._proxyTarget[key] = [];
            }
            if (key.startsWith("$")) {
                delete proxy[key];
            }
        }
    }

    getPoxyFromObject(name, object, proxy) {
        this.collections[name] = proxyObject(object, this.valueChanged, this.valueAccessed, this);
        return this.collections[name];
    };

    valueChanged(target, property, value, collectionManagerInstance, oldValue) {
        if (!(typeof property === "string")) return;
        if (target._proxyName && collectionManagerInstance.collections[target._proxyName] && collectionManagerInstance.viewManager.proxy["_$targets" + target._proxyName]) {
            var targets = collectionManagerInstance.viewManager.proxy["_$targets" + target._proxyName];
            targets.forEach(destination => {
                var destResult = destination(target, property, value);
                if (typeof destResult === "object" && destResult[property]) {
                    destResult[property](target, property, value);
                }
            });
        }
        //removes current bindings to the old object
        if ((typeof target[property] == "object" && !Array.isArray(oldValue) && !Array.isArray(value)) && typeof oldValue !== "undefined") {
            collectionManagerInstance.removeAllBindings(oldValue, collectionManagerInstance, target, property);
        }
        else if (Array.isArray(oldValue)) {
            for (var i = 0; i < oldValue.length; i++) {
                var row = oldValue[i];
                collectionManagerInstance.originalHTMLBindings.delete(row);
                collectionManagerInstance.deleteObject(row, false, collectionManagerInstance);
            }
            collectionManagerInstance.originalHTMLBindings.delete(oldValue);
            collectionManagerInstance.updateElementDom(collectionManagerInstance, target, property);
        }
        else {
            collectionManagerInstance.updateElementDom(collectionManagerInstance, target, property);
        }
        //if assigned is an object, run all the bindings to check if any unassigned binding can be assigned
        if (typeof target == "object" && !Array.isArray(target) && (!value || (!value.then && !(value instanceof assignable)))) {
            var unbindedNodes = new Map();
            var that = this;
            var bindings = Array.from(collectionManagerInstance.unbindedHTMLBindings.keys());
            bindings.forEach(unbindedBinding => {
                try {
                    var targetValue = collectionManagerInstance.runBindingFunc(unbindedBinding.bindingMethod);
                    collectionManagerInstance.listen(unbindedBinding, targetValue);
                    collectionManagerInstance.runBindingFunc(unbindedBinding.bindingMethod);
                    collectionManagerInstance.stopListen();
                    unbindedBinding.updateDom();
                }
                catch (e) {
                    unbindedNodes.set(unbindedBinding, true);
                };
            });
            collectionManagerInstance.unbindedHTMLBindings = unbindedNodes;
        }
    };

    updateElementDom(collectionManagerInstance, target, property) {
        var elementBindings = collectionManagerInstance.originalHTMLBindings.get(target);
        //updates current values
        if (elementBindings) {
            var propertyBindings = elementBindings.get(property);
            if (propertyBindings) {
                propertyBindings.forEach(x => x.updateDom());
            }
        }
    }

    removeAllBindings(oldValue, collectionManagerInstance, target, property) {
        if (Array.isArray(oldValue)) {
            for (var i = 0; i < oldValue.length; i++) {
                var row = oldValue[i];
                collectionManagerInstance.originalHTMLBindings.delete(row);
                collectionManagerInstance.deleteObject(row, false, collectionManagerInstance);
            }
            collectionManagerInstance.originalHTMLBindings.delete(oldValue);
        }
        else if (typeof oldValue == "object") {
            collectionManagerInstance.deleteObject(oldValue, true, collectionManagerInstance);
        }

    }

    listen(currentBindable, targetValue) {
        if (currentBindable) {
            this.currentBindable = currentBindable;
            this.targetValue = targetValue;
        } else {
            this.currentBindable = null;
        }
    }

    stopListen() {
        this.currentBindable = null;
        this.targetValue = null;
    }

    valueAccessed(target, property, collectionManagerInstance, receiver) {
        if (!(typeof property === "string")) return;
        if (collectionManagerInstance.currentBindable) {
            var elementValue = collectionManagerInstance.originalHTMLBindings.get(receiver);
            if (!elementValue) {
                elementValue = new Map();
                collectionManagerInstance.originalHTMLBindings.set(receiver, elementValue)
            }
            var propValue = elementValue.get(property);
            if (!propValue) {
                propValue = [];
                elementValue.set(property, propValue)
            }
            if (propValue.filter(x => x == collectionManagerInstance.currentBindable).length == 0) {
                propValue.push(collectionManagerInstance.currentBindable);
            }
            var value = target[property];
            if (value == collectionManagerInstance.targetValue) {
                if (collectionManagerInstance.currentBindable.setValueProps) {
                    collectionManagerInstance.currentBindable.setValueProps(receiver, property);
                }
            }
        }
    };

    runBindingFunc(func) {
        var result = func();
        if (typeof result === "object" && !Array.isArray(result)) {
            for (var key in result) {
                var propertyType = typeof (result[key]);
                if (propertyType === "function") {
                    result[key] = this.runBindingFunc(result[key]);
                }
            }
        }
        return result;
    };

    registerUnbinded() {
        this.unbindedHTMLBindings.set(this.currentBindable, true);
        this.currentBindable = null;
    }
};

export { collectionManager };