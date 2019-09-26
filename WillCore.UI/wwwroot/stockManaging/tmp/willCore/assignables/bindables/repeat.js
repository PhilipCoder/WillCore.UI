import { bindable } from "../../binding/bindable.js";
import { execptionHander } from "../../helpers/exceptionHander.js";
import { assignable } from "../../binding/assignable.js";
import { elementProxy } from "../../binding/elementProxy.js";
import { idManager } from "../../views/idManager.js";

function getIdProxyHander(elements, viewManager) {
    var getElement = function (target, prop) {
        if (prop.startsWith("$")) {
            var elementId = new idManager(viewManager).get(prop.substring(1));
            function findNode(nodes) {
                for (var nodeI = 0; nodeI < nodes.length; nodeI++) {
                    var node = nodes[nodeI];
                    if (node.id == elementId) {
                        return node;
                    }
                    if (node.children) {
                        var childResult = findNode(node.children);
                        if (childResult) {
                            return childResult;
                        }
                    }
                }
            }
            var element = findNode(elements);
            if (!element) {
                execptionHander.handleExeception("Can't find element", `Unable to find HTML DOM element with ID ${prop}.`);
            }
            else {
                return element;
            }
        } else {
            execptionHander.handleExeception("Can't find element", `Unable to find HTML DOM element with ID ${prop}.`);
        }
    }
    function get(target, prop, proxyInstance) {
        if (!prop.startsWith("$")) {
            execptionHander.handleExeception(`Can't get property ${prop} in iterator function. Only elements starting with $ can be retrieved.`);
        }
        return elementProxy(getElement(target, prop), set, target, prop, proxyInstance);
    };
    function set(obj, prop, value) {
        if (!prop.startsWith("$")) {
            execptionHander.handleExeception(`Can't assign property ${prop} in iterator function. Only elements starting with $ can be assigned.`);
        }
        function handleSet(obj, prop, value) {
            if (!obj[prop] && Array.isArray(value)) {
                value.forEach(assignmentVal => handleSet(obj, prop, assignmentVal));
                return;
            }
            if (!obj[prop]) {
                var element = getElement(obj, prop);
                obj[prop] = new value(obj.viewManager);
                obj[prop].setElement(element);
                obj[prop].assignmentCompletionEvent = data => {
                    delete obj[prop];
                };
            } else if (obj[prop] instanceof assignable) {
                obj[prop].assign(value);
            }
        }
        handleSet(obj, prop, value);
        return true;
    };
    var viewProxyHander = {
        get: get,
        set: set
    };
    var baseProxyObj = {
        elements: elements,
        viewManager: viewManager
    };
    var proxy = new Proxy(baseProxyObj, viewProxyHander);
    return proxy;
}

class repeat extends bindable {
    constructor(viewManager) {
        super({ function: 2 }, viewManager);
        super.topInstance = this;
        this.bindingMethod;
        this.repeatFunction;
    }
    repeat(iterator) {
        super.assign(iterator);
    }
    setValues(values) {
        if (!this.element) return;
        this.bindingMethod = values.function[0];
        this.repeatFunction = values.function[1];
        this.originalChildren = this.getCopyOfElements([this.element]);
        try {
            this.viewManager.collectionManager.listen(this, this);
            var targetValue = this.bindingMethod();
            this.viewManager.collectionManager.stopListen();
            this.parentElement = this.element.parentElement;
            this.updateDom();
        } catch (e) {
            this.viewManager.collectionManager.registerUnbinded();
        }
    }
    getCopyOfElements(nodes) {
        var result = [];
        for (var i = 0; i < nodes.length; i++) {
            result.push(nodes[i].cloneNode(true));
        }
        return result;
    }
    clearIds(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            node.id = "";
            if (node.children) {
                this.clearIds(node.children);
            }
        }
    }
    appendNodesToDom(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            this.parentElement.appendChild(nodes[i]);
        }
    }
    updateDom() {
        var targetValue = this.bindingMethod();
        if (!this.element || typeof targetValue == "undefined") return;
        this.parentElement.innerHTML = "";;
        if (!Array.isArray(targetValue)) {
            execptionHander.handleExeception("Invalid repeat assignment", `Repeats must be assigned to arrays!`);
        }
        for (var i = 0; i < targetValue.length; i++) {
            var elements = this.getCopyOfElements(this.originalChildren);
            var idProxy = getIdProxyHander(elements, this.viewManager);
            this.repeatFunction(idProxy, targetValue[i]);
            this.appendNodesToDom(elements);
        }

        return targetValue;
    }
};

assignable.registerBindable("repeat", repeat);

export { repeat };