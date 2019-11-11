import { Dropdown } from "./bootstrapNative.js"
//Changes: cache the html so that the loading does not happen async
class bootstrapDropdown extends HTMLElement {
    constructor() {
        super();
        willCore["bootstrap-dropdown"].load(this);
    }
    main(view) {
        view.values = { label: "hello world", items: [] };
    }
    init() {
        //Bindings
        this.view.$dropdownMenuLink.innerHTML = () => this.view.values.label;
        this.view.$menuItem.repeat = () => this.view.values.items;
        this.view.$menuItem.repeat((elements, row, index) => {
            this.repeatFunction(elements, row, index);
        });
        //Init the bootstrap component
        var dropdown = new Dropdown(this.view.$dropdownMenuLink.element);
    }
    load(repeatFunction) {
        if (this._view && this.ready) {
            this.ready(this._view);
        }
        this.repeatFunction = repeatFunction;
        
    }
    get view() {
        return this._view;
    }
    set view(value) {
        console.log(value);
        if (this.ready) {
            this.ready(value);
        }
        if (this.element) {
            this.element._view = value;
        } else {
            this._view = value;
        }
    }
    onready(ready) {
        this.element.ready = ready;
    }
}

export { bootstrapDropdown };