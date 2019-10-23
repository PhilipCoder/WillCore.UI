let event = {
    getFactoryInstance: () => {
        class event extends willCoreModules.bindable {
            constructor(viewManager) {
                super({ function: 1, string: 1 }, viewManager);
                super.topInstance = this;
                this.eventMethod;
                this.previousValue = null;
            }
            setValues(values) {
                if (!this.element) return;
                this.eventMethod = values.function[0];
                this.eventName = values.string[0];
                this.setValueProps();
            }

            setValueProps() {
                if (!this.element) return;
                let that = this;
                this.element[this.eventName] = function (event) {
                    that.eventMethod();
                    return true;
                };
            }
        };

        return event;
    }
}
export { event };