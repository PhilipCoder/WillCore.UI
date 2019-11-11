import { Dropdown } from "./bootstrapNative.js"

class bootstrapDropdown extends HTMLElement {
    constructor() {
        super();
        this.html = `<div class="dropdown">
  <a id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"  name="dropdown" class="nav-link">
    Dropdown link
  </a>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
    <li class="dropdown-item" id="menuItem"><a role="menuitem" id="link" name="dropdown"></a></li>
  </ul>
</div>`;
        willCore["bootstrap-dropdown"].load(this);
    }
    main(view) {
        view.values = { label: "hello world", items: [] };
    }
    load(repeatFunction) {
        //Bindings
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