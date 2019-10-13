class setLayoutInstance {
    static statement(target, property, value) {
        return !!value.getInstanceFactory;
    }
    static result(target, property, value) {
        target[property] = value.getInstanceFactory(target, property, value);
    }
}

export { setLayoutInstance };