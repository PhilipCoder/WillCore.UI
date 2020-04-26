import { assignable } from "/willcore/assignable/assignable.js"
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";
import { dataScope } from "./dataScope.js";
import { guid } from "../helpers/guid.js";

class bindable extends assignable {
    constructor(bindings, bindingFunctionIndex) {
        super(bindings, elementProxy);
        this.id = guid();
        this.bindingFunctionIndex = bindingFunctionIndex || 0;
        this.noName = true;
        this._element = null;
        this.twoWayBinding = false;
        this.boundValueObject = null;
        this.boundProperty = null;
    }

    static get noValues() {
        return this.noName ? elementProxy : undefined;
    }

    get element() {
        this._element = this._element || this.parentProxy._element;
        return this._element;
    }

    updateBoundValues(value) {
        this.boundValueObject[this.boundProperty] = value;
    }

    completionResult() {
        return false;
    }

    bind() {
        dataScope.setBindable(this);
        try {
            let updateValue = this.bindedValues.function[this.bindingFunctionIndex](this.parentProxy);
            dataScope.removeBindable();
            this.updateDOM(updateValue);
        } catch (e) {
            dataScope.removeBindable();
        }
    }

    completed() {
        this.bind();
    }

    updateDOM(value) {
        throw "Not Implemented";
    }
}

export { bindable };