var url = {
    getFactoryInstance: () => {
        class url extends willCoreModules.assignable {
            constructor() {
                super({ string: 1 });
                this.url = "";
                super.topInstance = this;
            }

            setValues(values) {
                this.url = values["string"][0];
            }

            static getInstanceFactory(target, property) {
                var newURL = new url();
                newURL.view = target[property];
                newURL.assignmentCompletionEvent = data => {
                    newURL.view.viewManager.setUrl(data);
                    target[property] = newURL.view;
                };
                return newURL;
            }
        };
        return url;
    }
}
export { url };