let view = {
    getFactoryInstance: () => {
        class view extends willCoreModules.bindable {
            constructor(viewManager) {
                super({ object: 1, string: 3, function: 1 }, viewManager);
                super.topInstance = this;
                this.bindingMethod;
                this.deleteFromProxy = false;
            }

            async setValues(values) {
                if (!this.element) return;
                let display = getComputedStyle(this.element).display;
                let that = this;
                this.element.display = "none";
                this.viewScope = values.object[0];
                let view = willCoreModules.viewFactory.getView(new Date().getTime(), this.viewManager.coreProxy, this.viewScope, this.viewManager);
                this.view = view;
                view._proxyTarget._isPartial = true;
                view.viewManager.element = this.element;
                view.viewManager.element.style.display = "none";
                view.viewManager.htmlURL = values.string[0].endsWith(".html") ? values.string[0] : values.string[1];
                view.viewManager.jsURL = values.string[0].endsWith(".js") ? values.string[0] : values.string[1];
                view.viewManager.element.style.display = "none";
                this.viewManager.childViews.push(view.viewManager);
                await willCoreModules.viewLoader.loadView(view, this.viewManager.coreProxy);
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

        return view;
    }
}
export { view };