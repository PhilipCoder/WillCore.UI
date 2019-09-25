﻿import { bindable } from "../../binding/bindable.js";
import { assignable } from "../../binding/assignable.js";

class innerHTML extends bindable {
    constructor(viewManager) {
        super({ function: 1 }, viewManager);
        super.topInstance = this;
        this.bindingMethod;
    }
    setValues(values) {
        if (!this.element) return;
        try {
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
        if (!this.element || typeof targetValue == "undefined") return;
        this.element.innerHTML = targetValue;
        return targetValue;
    }
};

assignable.registerBindable("innerHTML", innerHTML);

export { innerHTML };