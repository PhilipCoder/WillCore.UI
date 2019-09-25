import { bindable } from "../../binding/bindable.js";
import { viewFactory } from "../../views/viewFactory.js";
import { viewLoader } from "../../views/viewLoader.js";
import { assignable } from "../../binding/assignable.js";

class partial extends bindable {
    constructor(viewManager) {
        super({ object:1,string:2 }, viewManager);
        super.topInstance = this;
        this.bindingMethod;
        this.deleteFromProxy = false;
    }

    setProxiesAsPartial(obj) {
        for (var key in obj) {
            if (typeof obj[key] === "object") {
                obj[key]._isPartial = true;
                this.setProxiesAsPartial(obj[key]);
            }
        }
    }

    setValues(values) {
        if (!this.element) return;
        this.viewScope = values.object[0];
        this.setProxiesAsPartial(this.viewScope);
        var view = viewFactory.getView(new Date().getTime(), this.viewManager.coreProxy, this.viewScope, this.viewManager);
        this.view = view;
        view.viewManager.element = this.element;
        view.viewManager.htmlURL = values.string[0].endsWith(".html") ? values.string[0] : values.string[1];
        view.viewManager.jsURL = values.string[0].endsWith(".js") ? values.string[0] : values.string[1];
        this.viewManager.childViews.push(view.viewManager);
        viewLoader.loadView(view, this.viewManager.coreProxy, this.viewScope );
    }
    updateDom() {
    }
    unload() {
        this.view.viewManager.unload();
        this.element.innerHTML = "";
    }
};

assignable.registerBindable("partial", partial);

export { partial };