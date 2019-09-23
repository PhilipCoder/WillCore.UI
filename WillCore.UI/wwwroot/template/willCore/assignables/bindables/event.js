import { bindable } from "../../binding/bindable.js";
import { assignable } from "../../binding/assignable.js";

class event extends bindable {
    constructor(viewManager) {
        super({ function: 1, string: 1 }, viewManager);
        super.topInstance = this;
        this.eventMethod;
        this.previousValue = null;
    }
    setValues(values) {
        if (!this.element) return;
        this.eventMethod = values.function[0];
        this.eventName = values.string[0];
        this.setValueProps();
    }

    setValueProps() {
        if (!this.element) return;
        var that = this;
        this.element[this.eventName] = function (event) {
            that.eventMethod();
            return true;
        };
    }
};

assignable.registerBindable("event", event);

export { event };