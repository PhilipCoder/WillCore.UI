class getDefaultElement {
    static statement(target, property) {
        return !target[property] && property.startsWith("$");
    }
    static result(target, property) {
        let elementId = property.substring(1);
        let element = new willCoreModules.idManager(null).getElement(elementId);
        return element || document.createElement("div");
    }
}

export { getDefaultElement };