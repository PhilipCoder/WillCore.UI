class setDefaultAssignable {
    static statement(target, property, value) {
        return (value.assignmentMethods && value.assignmentMethods.assignmentMethod) || (target[property] instanceof willCoreModules.assignable);
    }
    static result(target, property, value) {
        if (value.assignmentMethods && value.assignmentMethods.assignmentMethod) {
            value.assignmentMethods.assignmentMethod(target, property, value);
        } else if (target[property] instanceof willCoreModules.assignable) {
            target[property].assign(value);
        }
    }
}

export { setDefaultAssignable };