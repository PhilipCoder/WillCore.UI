class getDefaultElement {
    static statement(target, property) {
        return !target[property] && property.startsWith("$");
    }
    static result(target, property) {
        var elementId = property.substring(1);
        var element = new willCoreModules.idManager(null).getElement(elementId);
        return element || document.createElement("div");
    }
}

export { getDefaultElement };