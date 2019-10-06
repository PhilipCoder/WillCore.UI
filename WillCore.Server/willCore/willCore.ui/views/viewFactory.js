import { viewManager } from "../views/viewManager.js";
import { assignable } from "../binding/assignable.js";
import { elementProxy } from "../binding/elementProxy.js";
import { execptionHander } from "../helpers/exceptionHander.js";
import { idManager } from "../views/idManager.js";
import { partial } from "../assignables/bindables/view.js";

class viewFactory {
    static getView(name, coreProxy, initProxies, parentViewManager) {
        var proxy = null;
        //==============================bindingMethods===============================================
        //Method that creates a new proxy when an object is assigned to a view
        var handleProxy = (obj, prop, value, proxyInstance, propValue) => {
            if (typeof value == "function") {
                var isSource = value.toString();
                isSource = isSource.substring(isSource.indexOf("(") + 1, isSource.indexOf(")")).trim().length == 0
                if (isSource) {
                    obj["_$Sources" + prop] = obj["_$Sources" + prop] || [];
                    obj["_$Sources" + prop].push(value);
                    obj["_" + prop] = function () {
                        var sources = obj["_$Sources" + prop];
                        for (var i = 0; i < sources.length; i++) {
                            var source = sources[i];
                            var result = source();
                            if (typeof result !== "undefined" && result !== null) {
                                proxyInstance[prop] = result;
                            }
                        }
                    }
                } else {
                    obj["_$targets" + prop] = obj["_$targets" + prop] || [];
                    obj["_$targets" + prop].push(value);
                }
            } else if (!propValue || !propValue.value) {
                var oldValue = obj[prop];
                var proxyValueTarget = { value: value._proxyTarget ? value._proxyTarget : value };
                proxyValueTarget._proxyName = prop;
                obj[prop] = obj.viewManager.collectionManager.getPoxyFromObject(prop, proxyValueTarget, obj);
                obj.viewManager.collectionManager.valueChanged(obj, prop, value, obj.viewManager.collectionManager, oldValue);
            }
            else {
                propValue.value = value;
            }
        };
        //Method that handles assignables that are assigned to a view
        var handleAssignable = (obj, prop, value, proxyInstance, propValue) => {
            var elementId = prop.substring(1);
            var documentVar = typeof window === "undefined" ? null : document;
            var element = documentVar ? new idManager(proxy.viewManager).getElement(elementId) : null;
            propValue = new value(obj.viewManager);
            if (!prop.startsWith("$") && typeof obj[prop] === "object" && propValue.deleteCollection) {
                delete proxyInstance[prop]
            }
            if (value.loadTarget) {
                value.loadTarget(obj, prop, propValue);
            }
            obj[prop] = propValue;
            propValue.name = prop;
            propValue.proxy = proxyInstance;
            propValue.target = obj;
            if (propValue.setElement) {
                propValue.setElement(element);
            }
            propValue.assignmentCompletionEvent = propValue.deleteFromProxy !== false ? data => { delete obj[prop]; } : () => { };
        };

        //Method that handles arrays that are assigned to a view
        var handleArray = (obj, prop, value, proxyInstance, propValue, handleSet) => {
            if (prop.startsWith("$") || (value[0].assignAbleToNonElement && value[0].assignAbleToNonElement)) {
                value.forEach(assignmentVal => handleSet(obj, prop, assignmentVal));
            } else if (!prop.startsWith("$")) {
                if (obj[prop] && obj[prop]._isProxy) {
                    obj[prop].value = obj.viewManager.collectionManager.getPoxyFromObject(prop, value, obj);
                } else {
                    value._proxyName = prop;
                    obj[prop] = obj.viewManager.collectionManager.getPoxyFromObject(prop, { value: value }, obj);
                }
            } else {
                execptionHander.handleExeception("Invalid Assignment", `Unable to assign value to ${prop}. Please check assignment values and sequence.`);
            }
        };
        //The trap used for the view's proxy to intercept get requests on the base
        function getTrap(target, prop, proxyInstance) {
            if (prop == "_proxyTarget") {
                return target;
            }
            if (prop.startsWith("_"))
                return target[prop];

            if (!target[prop] && prop.startsWith("$")) {
                var elementId = prop.substring(1);
                var element = new idManager(proxy.viewManager).getElement(elementId);
                if (!element) {
                    var result = document.createElement("div");
                    result.id = elementId;
                    return elementProxy(result, setTrap, target, prop, proxyInstance);;
                }
                else {
                    return elementProxy(element, setTrap, target, prop, proxyInstance);
                }
            }
            if (target[prop] instanceof partial) {
                return target[prop].view;
            }
            return target[prop] && target[prop].value ? target[prop].value : target[prop];
        };
        //The trap used for the view's proxy to intercept set requests on the base
        function setTrap(obj, prop, value, proxyInstance) {
            if (prop.startsWith("_"))
                return true;
            function handleSet(obj, prop, value, propValue = obj[prop]) {
                if (Array.isArray(value) && !prop.startsWith("$")) {
                    handleArray(obj, prop, value, proxyInstance, propValue, handleSet);
                }
                else if (Array.isArray(value) && prop.startsWith("$")) {
                    value.forEach(item => { handleSet(obj, prop, item); });
                }
                else if ((prop.startsWith("$") || (value.assignAbleToNonElement && value.assignAbleToNonElement)) && (propValue instanceof assignable) === false && !!value.registerBindable) {
                    handleAssignable(obj, prop, value, proxyInstance, propValue);
                } else if (propValue instanceof assignable) {
                    propValue.assign(value);
                    if (propValue.setTarget) {
                        propValue.setTarget(obj, prop);
                    }
                }
                else if (!prop.startsWith("$") && typeof (value) == "object" || typeof (value) == "function") {
                    handleProxy(obj, prop, value, proxyInstance, propValue);
                } else if (prop === "onUnload") {
                    obj.viewManager.onUnloadEvent = value;
                } else {
                    execptionHander.handleExeception("Invalid Assignment", `Unable to assign value to ${prop}. Please check assignment values and sequence.`);
                }
            }
            handleSet(obj, prop, value);
            return true;
        };
        //The trap used for the view's proxy to intercept delete requests on the base
        function deletePropertyTrap(target, prop) {
            var value = target[prop];
            if (value instanceof partial) {
                value.unload();
            }
            if (!prop.startsWith("$")) {
                target.viewManager.collectionManager.removeAllBindings(target[prop], target.viewManager.collectionManager, target, prop);
            } else {
                var element = new idManager(target.viewManager).removeElement(prop.replace("$", ""));
                target.viewManager.collectionManager.removeAllElementBindings(element);
            }
            delete target[prop];
            return true;
        };

        //Creates a new proxy
        var viewProxyHander = {
            get: getTrap,
            set: setTrap,
            deleteProperty: deletePropertyTrap
        };
        var baseProxyObj = { viewManager: new viewManager(name), onUnload: null, assignmentMethods: { assignmentMethod: null } };
        proxy = new Proxy(baseProxyObj, viewProxyHander);
        proxy.viewManager.proxy = proxy;
        proxy.viewManager.coreProxy = coreProxy;
        proxy.viewManager.parentViewManager = parentViewManager;
        proxy.route = { _skipCleanup: true };
        //Copies the values from a parent view to the proxy of the child view
        if (initProxies) {
            for (var key in initProxies) {
                proxy[key] = initProxies[key];
            }
        }
        return proxy;
    }
};

export { viewFactory };

