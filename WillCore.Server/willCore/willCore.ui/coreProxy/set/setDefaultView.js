class setDefaultView {
    static statement(target, property, value) {
        return value && value.nodeType === 1;
    }
    static result(target, property, value) {
        value = value.element || value;
        if (!target[property]) {
            target[property] = willCoreModules.viewFactory.getView(property, target);
        }
        if (target[property].viewManager.element) {
            willCoreModules.execptionHander.handleExeception("Invalid Operation", `The DOM element for view is already assigned.`);
        }
        target[property].viewManager.element = value.id;
    }
}

export { setDefaultView };