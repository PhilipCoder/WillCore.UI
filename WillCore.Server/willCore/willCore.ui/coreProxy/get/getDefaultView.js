class getDefaultView {
    static statement(target, property, willCoreInstance) {
        return !target[property] || willCoreInstance._init;
    }
    static result(target, property) {
        target[property] = willCoreModules.viewFactory.getView(property, target);
        return target[property];
    }
}

export { getDefaultView };