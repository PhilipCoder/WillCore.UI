import { willCore } from "../../WillCore.js";

let component = {
    getFactoryInstance: () => {
        class component extends willCoreModules.bindable {
            //index.js
            //willCore["my-component"] = [willCoreModules.component,"/component.js", {extends: 'p'}];
            //component
            //willCore["my-component"].load(this,"/component.html");
            constructor(viewManager) {
                super({ object: 1, string: 2 }, viewManager);
                super.topInstance = this;
                this.bindingMethod;
                this.deleteFromProxy = false;
                this.name = "";
                this.loaded = false;
                this.jsURL = "";
                this.html = null;
            }

            setValues(values) {
                this.jsURL = values.string[0].endsWith(".js") ? values.string[0] : values.string[1];
                this.htmlURL = values.string[0].endsWith(".js") ? values.string[1] : values.string[0];
                willCoreModules.loadHTML(this.htmlURL).then((html) => {
                    this.html = html;
                })
                let settings = values.object[0];
                willCoreModules.lazyImport(this.jsURL).then(exportedComponent => {
                    customElements.define(this.name, exportedComponent[Object.keys(exportedComponent)[0]], settings);
                });
            }

            load(element) {
                this.init(element);
            }

            init(element) {
                if (!element.main) {
                    willCoreModules.execptionHander.handleExeception("Component Error", `The component ${this.name} does not have a main function.`);
                }
                let view = willCoreModules.viewFactory.getView(this.name, willCoreModules, {});
                view._proxyTarget.viewManager.name = willCoreModules.guid();
                view._proxyTarget.viewManager.element = element;
                view._proxyTarget.viewManager.forceElement = element;
                view._proxyTarget.viewManager.htmlURL = this.html;
                view._proxyTarget.viewManager.jsURL = element.main;
                view._proxyTarget._isPartial = true;
                element.view = willCoreModules.viewLoader.loadViewSync(view, element.main, this.html);
            }
            static mainAssignable() { return true };
        }
        return component;
    }
}
export { component };