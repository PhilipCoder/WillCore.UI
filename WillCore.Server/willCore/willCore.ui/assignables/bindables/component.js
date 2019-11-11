import { willCore } from "../../WillCore.js";

let component = {
    getFactoryInstance: () => {
        class component extends willCoreModules.bindable {
            //index.js
            //willCore["my-component"] = [willCoreModules.component,"/component.js", {extends: 'p'}];
            //component
            //willCore["my-component"].load(this,"/component.html");
            constructor(viewManager) {
                super({ object: 1, string: 1 }, viewManager);
                super.topInstance = this;
                this.bindingMethod;
                this.deleteFromProxy = false;
                this.name = "";
                this.loaded = false;
                this.jsURL = "";
            }

            setValues(values) {
                this.jsURL = values.string[0].endsWith(".js") ? values.string[0] : values.string[1];
                let settings = values.object[0];
                willCoreModules.lazyImport(this.jsURL).then(exportedComponent => {
                    customElements.define(this.name, exportedComponent[Object.keys(exportedComponent)[0]], settings);
                });
            }

            load(element) {
                this.init(element);
            }

            async init(element) {
                if (!element.main) {
                    willCoreModules.execptionHander.handleExeception("Component Error", `The component ${this.name} does not have a main function.`);
                }
                let view = willCoreModules.viewFactory.getView(this.name, willCoreModules, {});
                view._proxyTarget.viewManager.name = willCoreModules.guid();
                view._proxyTarget.viewManager.element = element;
                view._proxyTarget.viewManager.forceElement = element;
                view._proxyTarget.viewManager.htmlURL = element.html ? element.html : element.innerHTML;
                view._proxyTarget.viewManager.jsURL = element.main;
                view._proxyTarget._isPartial = true;
                element.view = await willCoreModules.viewLoader.loadView(view);
            }
            static mainAssignable() { return true };
        }
        return component;
    }
}
export { component };