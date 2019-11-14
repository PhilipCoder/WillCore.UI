class bootstrapDropdown extends HTMLElement {
    constructor() {
        super();
        this.view = null;
        willCore["$safeitemname$"].load(this);
    }
    main(view) {
        view.values = { };
    }

}

export { bootstrapDropdown };