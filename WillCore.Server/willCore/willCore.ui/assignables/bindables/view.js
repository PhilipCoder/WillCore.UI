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

    async setValues(values) {
        if (!this.element) return;
        var display = getComputedStyle(this.element).display;
        var that = this;
        this.element.display = "none";
        this.viewScope = values.object[0];
        this.setProxiesAsPartial(this.viewScope);
        var view = viewFactory.getView(new Date().getTime(), this.viewManager.coreProxy, this.viewScope, this.viewManager);
        this.view = view;
        view._proxyTarget._isPartial = true;
        view.viewManager.element = this.element;
        view.viewManager.element.style.display = "none";
        view.viewManager.htmlURL = values.string[0].endsWith(".html") ? values.string[0] : values.string[1];
        view.viewManager.jsURL = values.string[0].endsWith(".js") ? values.string[0] : values.string[1];
        view.viewManager.element.style.display = "none";
        this.viewManager.childViews.push(view.viewManager);
        await viewLoader.loadView(view, this.viewManager.coreProxy);
        that.element.display = display;
        view.viewManager.element.style.display = display;
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