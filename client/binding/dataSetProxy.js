import { dataScope } from "./dataScope.js";

class dataSetProxyHandler {
    constructor() {
        this.bindings = {};
    }
    //Set
    set(target, property, value, proxy) {
        this.ensureBindingArray(property);
        if (typeof value === "object") {
            this.handleObjectAssignment(target, property, value);
        } else {
            this.handleAssignment(target, property, value);
        }
        return true;
    }

    handleAssignment(target, property, value) {
        target[property] = value;
        this.bindings[property].forEach((binding) => {
            if (binding !== dataScope.bindable) {
                binding.updateDOM(value);
            }
        });
    }

    handleObjectAssignment(target, property, value) {
        target[property] = dataSetProxyFactory(value._isDataSet ? value._target : value);
        this.bindings[property].forEach((binding) => {
            binding.bind();
        });
    }

    ensureBindingArray(property) {
        if (!this.bindings[property]) {
            this.bindings[property] = [];
        }
    }

    //Get
    get(target, property, proxy) {
        if (property === "_target") {
            return target;
        }
        else if (property === "_isDataSet") {
            return true;
        }
        else if (dataScope.hasBindable()) {
            this.ensureBindingArray(property);
            this.bindings[property].push(dataScope.bindable);
            if (dataScope.bindable.twoWayBinding) {
                dataScope.bindable.boundValueObject = proxy;
                dataScope.bindable.boundProperty = property;
            }
        }
        return target[property];
    }

    //Delete
    delete(target, property) {
        delete target[property];
        this.bindings[property].forEach((binding) => {
            binding.bind();
        });
    }
}

let dataSetProxyFactory = (target) => {
    return new Proxy(target || {}, new dataSetProxyHandler())
};

export { dataSetProxyFactory };