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
        if (curObj instanceof willCoreModules.assignable) return;
        if (moveToUnbinded) {
            let nodes = collectionManagerInstance.originalHTMLBindings.get(curObj);
            if (nodes && nodes.values) {
                let values = Array.from(nodes.values());
                if (values.length > 0) {
                    for (let valueCollectionIndex = 0; valueCollectionIndex < values.length; valueCollectionIndex++) {
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
        for (let keyToRemove in this.collections) {
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
        for (let key in proxy) {
            if (key.startsWith("_$Sources") || key.startsWith("_$targets")) {
                proxy._proxyTarget[key] = [];
            }
            if (key.startsWith("$")) {
                delete proxy._proxyTarget[key];
            }// else if (proxy._proxyTarget[key] instanceof willCoreModules.assignable) {
            //    delete proxy._proxyTarget[key];
            //}
        }
    }

    getPoxyFromObject(name, object, proxy) {
        this.collections[name] = willCoreModules.proxyObject(object, this.valueChanged, this.valueAccessed, this);
        return this.collections[name];
    };

    valueChanged(target, property, value, collectionManagerInstance, oldValue) {
        if (!(typeof property === "string")) return;
        if (target._proxyName && collectionManagerInstance.collections[target._proxyName] && collectionManagerInstance.viewManager.proxy["_$targets" + target._proxyName]) {
            let targets = collectionManagerInstance.viewManager.proxy["_$targets" + target._proxyName];
            targets.forEach(destination => {
                let destResult = destination(target, property, value);
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
        if (typeof target == "object" && !Array.isArray(target) && (!value || (!value.then && !(value instanceof willCoreModules.assignable)))) {
            let unbindedNodes = new Map();
            let that = this;
            let bindings = Array.from(collectionManagerInstance.unbindedHTMLBindings.keys());
            bindings.forEach(unbindedBinding => {
                try {
                    let targetValue = collectionManagerInstance.runBindingFunc(unbindedBinding.bindingMethod);
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
        let elementBindings = collectionManagerInstance.originalHTMLBindings.get(target);
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
            for (let i = 0; i < oldValue.length; i++) {
                let row = oldValue[i];
                collectionManagerInstance.originalHTMLBindings.delete(row);
                collectionManagerInstance.deleteObject(row, false, collectionManagerInstance);
            }
            collectionManagerInstance.originalHTMLBindings.delete(oldValue);
        }
        else if (typeof oldValue == "object") {
            collectionManagerInstance.deleteObject(oldValue, true, collectionManagerInstance);
        }

    }

    removeAllElementBindings(element) {
        let keys = Array.from(this.originalHTMLBindings.keys());
        keys.forEach(key => {
            let targetObj = this.originalHTMLBindings.get(key);
            if (targetObj) {
                let fields = Array.from(targetObj.keys());
                fields.forEach(field => {
                    var bindingArray = targetObj.get(field);
                    if (bindingArray && Array.isArray(bindingArray)) {
                        bindingArray.forEach(binding => {
                            if (binding.element.id === element.id) {
                                binding.removed = true;
                            }
                        });
                        bindingArray = bindingArray.filter(x => !x.removed);
                        targetObj.set(field, bindingArray);
                    }
                });
            }
        });
        let unbindedKeys = Array.from(this.unbindedHTMLBindings.keys());
        unbindedKeys.forEach(binding => {
            if (binding.element.id === element.id) {
                this.unbindedHTMLBindings.delete(binding);
            }
        });
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
            let elementValue = collectionManagerInstance.originalHTMLBindings.get(receiver);
            if (!elementValue) {
                elementValue = new Map();
                collectionManagerInstance.originalHTMLBindings.set(receiver, elementValue)
            }
            let propValue = elementValue.get(property);
            if (!propValue) {
                propValue = [];
                elementValue.set(property, propValue)
            }
            if (propValue.filter(x => x == collectionManagerInstance.currentBindable).length == 0) {
                propValue.push(collectionManagerInstance.currentBindable);
            }
            let value = target[property];
            if (value == collectionManagerInstance.targetValue) {
                if (collectionManagerInstance.currentBindable.setValueProps) {
                    collectionManagerInstance.currentBindable.setValueProps(receiver, property);
                }
            }
        }
    };

    runBindingFunc(func) {
        let result = func();
        if (typeof result === "object" && !Array.isArray(result)) {
            for (let key in result) {
                let propertyType = typeof (result[key]);
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