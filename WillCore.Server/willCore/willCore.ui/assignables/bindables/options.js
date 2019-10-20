//view.$options.model = () =>
//view.$options.options = () => view.list.map(x => [x.valueField, x.textField]);

var options = {
    getFactoryInstance: () => {
        class options extends willCoreModules.bindable {
            constructor(viewManager) {
                super({ function: 1 }, viewManager);
                super.topInstance = this;
                this.bindingMethod;
            }
            setValues(values) {
                if (!this.element) return;
                this.initialHTML = this.element.innerHTML;
                try {
                    this.bindingMethod = values.function[0];
                    this.viewManager.collectionManager.listen(this, this);
                    this.updateDom();
                    this.viewManager.collectionManager.stopListen();
                } catch (e) {
                    this.viewManager.collectionManager.registerUnbinded();
                }
            }
            updateDom() {
                this.element.innerHTML = this.initialHTML;
                var that = this;
                var targetValue = this.bindingMethod();
                if (!this.element) return;
                if (Array.isArray(targetValue)) {
                    targetValue.forEach(row => {
                        if (Array.isArray(row) && row.length > 1) {
                            var option = document.createElement("option");
                            option.innerHTML = row[1];
                            option.value = row[0];
                            that.element.appendChild(option);
                        }
                    });
                }
                return targetValue;
            }
        };
        return options;
    }
}
export { options };