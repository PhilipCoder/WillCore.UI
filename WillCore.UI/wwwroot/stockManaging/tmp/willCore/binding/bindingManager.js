class bindingMangager {
    constructor() {
        this.originalHTMLBindings = new WeakMap();
        this.dynamicHTMLBindings = new WeakMap();
    }

    clear() {
        this.originalHTMLBindings = new WeakMap();
        this.dynamicHTMLBindings = new WeakMap();
    }
};

export { bindingMangager };