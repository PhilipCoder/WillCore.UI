import { Dropdown } from "./bootstrapNative.js"
//Changes: cache the html so that the loading does not happen async
class bootstrapDropdown extends HTMLElement {
    constructor() {
        super();
        this.view = null;
        this.onclick = null;
        willCore["bootstrap-dropdown"].load(this);
    }
    main(view) {
        view.values = { label: "hello world", items: [] };
    }

    set label(value) {
        this.view.values.label = value;
    }

    set items(value) {
        this.view.values.items = value;
    }

    set iterator(repeatFunction) {
        this.view.$dropdownMenuLink.innerHTML = () => this.view.values.label;
        this.view.$menuItem.repeat = () => this.view.values.items;
        this.view.$menuItem.repeat((elements, row, index) => {
            repeatFunction(elements, row, index);
        });
        //Init the bootstrap component
        var dropdown = new Dropdown(this.view.$dropdownMenuLink.element);
    }
}

export { bootstrapDropdown };