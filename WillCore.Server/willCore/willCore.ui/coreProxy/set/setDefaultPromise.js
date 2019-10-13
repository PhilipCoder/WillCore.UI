class setDefaultPromise {
    static statement(target, property, value) {
        return typeof value.then !== "undefined";
    }
    static result(target, property, value) {
        return true;
    }
}

export { setDefaultPromise };