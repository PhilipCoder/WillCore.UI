/**
 * Component base class.
 * */
class userComponent extends HTMLElement {
    constructor() {
        super();
        this.loaded = false;
        this._topInstance = null;
    }

    set instance(topInstance) {
        this._topInstance = topInstance;
        willCore[this._topInstance.name].load(this._topInstance);
    }
    get instance() {
        return this._topInstance;
    }

    init(view) {
        this._topInstance.view = view;
    }


}

export { userComponent };