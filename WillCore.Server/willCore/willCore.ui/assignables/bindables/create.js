let create = {
    getFactoryInstance: () => {
        class create extends willCoreModules.bindable {
            constructor(viewManager) {
                super({ object: 1, string: 1 }, viewManager);
                super.topInstance = this;
                this.bindingMethod;
            }
            setValues(values) {
                if (!this.element) return;
                let newElemenId = `${this.proxy.viewManager.name}.${this.element.tmpId}`;
                try {
                    let attributes = values.object[0];
                    let elementType = values.string[0];
                    let newElement = document.createElement(elementType);
                    for (let key in attributes) {
                        newElement.setAttribute(key, attributes[key]);
                    }
                    newElement.id = newElemenId;
                    this.element.appendChild(newElement);
                } catch (e) {
                }
            }
            updateDom() {
            }
        };

        return create;
    }
}
export { create };