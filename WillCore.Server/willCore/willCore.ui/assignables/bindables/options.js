//view.$options.model = () =>
//view.$options.options.repeat = () => view.list;
//view.$options.value = row => row.valueField;
//view.$options.text = row => row.textField;

var options = {
    getFactoryInstance: () => {
        class options extends willCoreModules.bindable {
            constructor(viewManager) {
                super({ function: 3, string: 3 }, viewManager);
                super.topInstance = this;
                this.bindingMethod;
            }
            setValues(values) {
                if (!this.element) return;

                try {
                    var display = getComputedStyle(this.element).display;
                    this.initialDisplayState = !display || display === "none" ? "block" : display;
                    this.bindingMethod = values.function[0];
                    this.viewManager.collectionManager.listen(this, this);
                    this.updateDom();
                    this.viewManager.collectionManager.stopListen();
                } catch (e) {
                    this.viewManager.collectionManager.registerUnbinded();
                }
            }
            updateDom() {
                var targetValue = this.bindingMethod();
                if (!this.element) return;
                this.element.style.display = targetValue ? this.initialDisplayState : "none";
                return targetValue;
            }
        };
        return options;
    }
}
export { options };