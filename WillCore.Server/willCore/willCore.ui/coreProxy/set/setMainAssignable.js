class setMainAssignable {
    static statement(target, property, value) {
        return value.mainAssignable && value.mainAssignable();
    }
    static result(target, property, value) {
        if (target[property] instanceof willCoreModules.assignable === false) {
            var propValue = new value(null);
            target[property] = propValue;
            if (propValue.loadTarget) {
                propValue.loadTarget(target, property, propValue);
            }
            propValue.name = property;
            propValue.assignmentCompletionEvent = propValue.deleteFromProxy !== false ? data => { delete target[property]; } : () => { };
        } else if (target[property] instanceof willCoreModules.assignable) {
            target[property].assign(value);
        }
    }
}

export { setMainAssignable };