import { bindable } from "../../binding/bindable.js";
import { viewFactory } from "../../views/viewFactory.js";
import { viewLoader } from "../../views/viewLoader.js";
import { assignable } from "../../binding/assignable.js";
import { idManager } from "../../views/idManager.js";
import { layoutProxyFactory } from "./layoutProxyFactory.js";
import { viewManager } from "../../views/viewManager.js";

class layout extends bindable {
    constructor(viewManager) {
        super({ string: 2 }, viewManager);
        this.viewManager.isLayout = true;
        super.topInstance = this;
        this.bindingMethod;
        this.name = "";
        this.view = null;
    }
    setValues(values) {
        this.viewScope = {};
        this.viewManager.isLayout = true;
        var view = viewFactory.getView(this.name, this.viewManager.coreProxy, this.viewScope);
        view.viewManager.element = document.getElementsByTagName("BODY")[0];
        view.viewManager.htmlURL = values.string[0].endsWith(".html") ? values.string[0] : values.string[1];
        view.viewManager.jsURL = values.string[0].endsWith(".js") ? values.string[0] : values.string[1];
        this.view = view;
    }
    updateDom() {
    }

    renderView() {
        return viewLoader.loadView(this.view, this.viewManager.coreProxy, this.viewScope);
    }

    static getInstanceFactory(target, property, value) {
        var newLayout = layoutProxyFactory.getLayout(new viewManager(property));
        newLayout.view = target[property];
        newLayout.name = property;
        newLayout.assignmentCompletionEvent = data => {
            newLayout.view.viewManager.isLayout = true;
            target[property] = newLayout.view;
            newLayout.view.assignmentMethods.assignmentMethod = (target, property, value) => {
                target[property].viewManager.layout = value;
                target[property].viewManager.parentViewManager = value.viewManager;
            };
        };
        return newLayout;
    }
};

assignable.registerBindable("layout", layout);

export { layout };