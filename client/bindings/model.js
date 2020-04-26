import { bindable } from "../binding/bindable.js";
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";

class component extends bindable {
    constructor() {
        super({ function: 1 }, 0);
        this.twoWayBinding = true;
    }

    static get noName() {
        return true;
    }

    static get noValues() {
        return elementProxy;
    }

    updateDOM(value){
        this.element.value = value;
    }

    completionResult(){
        this.element.oninput = (event) => {
            let value = "";
            if ("value" in this.element) {
                value = this.element.value;
            } else {
                throw "This type of model binding is not supported (yet)";
            }
            this.updateBoundValues(value);
            return true;
        };
    }
}

export { component };