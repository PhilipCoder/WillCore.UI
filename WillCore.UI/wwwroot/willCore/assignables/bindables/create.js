import { bindable } from "../../binding/bindable.js";
import { assignable } from "../../binding/assignable.js";

class create extends bindable {
    constructor(viewManager) {
        super({ object: 1, string:1 }, viewManager);
        super.topInstance = this;
        this.bindingMethod;
    }
    setValues(values) {
        if (!this.element) return;
        var newElemenId = `${this.proxy.viewManager.name}.${this.element.tmpId}`;
        try {
            var attributes = values.object[0];
            var elementType = values.string[0];
            var newElement = document.createElement(elementType);
            for (var key in attributes) {
                newElement.setAttribute(key, attributes[key]);
            }
            newElement.id = newElemenId;
            this.element.appendChild(newElement);
        } catch (e) {
        }
    }
    updateDom() {
    }
};

assignable.registerBindable("create", create);

export { create };