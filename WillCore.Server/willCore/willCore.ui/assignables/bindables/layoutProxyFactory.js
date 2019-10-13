var layoutProxyFactory = {
    getFactoryInstance: () => {
        class layoutProxyFactory {
            constructor() {

            }
            static getLayout(viewManager) {
                var view = new willCoreModules.layout(viewManager);
                var handler = {
                    get: function (target, property) {
                        if (property.startsWith("$")) {
                            var elementId = property.substring(1);
                            var element = new willCoreModules.idManager(view.viewManager).getElement(elementId);
                            return element || (() => { var newElement = document.createElement("div"); newElement.id = elementId; return newElement })();
                        }
                        return target[property];
                    },
                    set: function (target, property, value) {
                        target[property] = value;
                        return true;
                    }
                };
                return new Proxy(view, handler);
            }
        };

        return layoutProxyFactory;
    }
}
export { layoutProxyFactory };