var bindable = {
    getFactoryInstance: () => {
        class bindable extends willCoreModules.assignable {
            constructor(assignmentConstraints, viewManager) {
                super(assignmentConstraints);
                this.element = null;
                this.viewManager = viewManager;
            }
            static isBaseClass() {
                return "bindable";
            }
            setValues(values) {
                if (!this.element) return;
                this.bindingMethod = values.function[0];
                var targetValue = this.topInstance.updateDom();
                this.viewManager.collectionManager.listen(this, targetValue);
                targetValue = this.topInstance.bindingMethod();
            }

            setElement(element) {
                this.element = element;
            }
        };
        return bindable;
    }
}
export { bindable };