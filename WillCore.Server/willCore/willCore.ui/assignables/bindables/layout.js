let layout = {
    getFactoryInstance: () => {
        class layout extends willCoreModules.bindable {
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
                let view = willCoreModules.viewFactory.getView(this.name, this.viewManager.coreProxy, this.viewScope);
                view.viewManager.element = document.getElementsByTagName("BODY")[0];
                view.viewManager.htmlURL = values.string[0].endsWith(".html") ? values.string[0] : values.string[1];
                view.viewManager.jsURL = values.string[0].endsWith(".js") ? values.string[0] : values.string[1];
                this.view = view;
            }
            updateDom() {
            }

            renderView() {
                return willCoreModules.viewLoader.loadView(this.view, this.viewManager.coreProxy);
            }

            static getInstanceFactory(target, property, value) {
                let newLayout = willCoreModules.layoutProxyFactory.getLayout(new willCoreModules.viewManager(property));
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

        return layout;
    }
}
export { layout };