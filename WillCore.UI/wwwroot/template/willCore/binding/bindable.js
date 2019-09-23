import { assignable } from "../binding/assignable.js";

class bindable extends assignable {
    constructor(assignmentConstraints, viewManager) {
        super(assignmentConstraints);
        this.element = null;
        this.viewManager = viewManager;
    }
    setValues(values) {
        if (!this.element) return;
        this.bindingMethod = values.function[0];
        var targetValue = this.topInstance.updateDom();
        this.viewManager.collectionManager.listen(this, targetValue);
        targetValue = this.topInstance.bindingMethod();
    }

    setElement(element) {
        this.element = element;
    }
};

export { bindable };