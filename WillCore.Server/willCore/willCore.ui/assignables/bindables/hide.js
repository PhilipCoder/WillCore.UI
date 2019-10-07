import { bindable } from "../../binding/bindable.js";
import { assignable } from "../../binding/assignable.js";

class hide extends bindable {
    constructor(viewManager) {
        super({ function: 1 }, viewManager);
        super.topInstance = this;
        this.bindingMethod;
    }
    setValues(values) {
        if (!this.element) return;
        try {
            this.initialDisplayState = !this.element.style.display || this.element.style.display === "none" ? "block" : this.element.style.display;
            this.bindingMethod = values.function[0];
            this.viewManager.collectionManager.listen(this, this);
            this.updateDom();
            this.viewManager.collectionManager.stopListen();
        } catch (e) {
            this.viewManager.collectionManager.registerUnbinded();
        }
    }
    updateDom() {
        var targetValue = this.bindingMethod();
        if (!this.element ) return;
        this.element.style.display = targetValue ? "none" : this.initialDisplayState;
        return targetValue;
    }
};

assignable.registerBindable("hide", hide);

export { hide };