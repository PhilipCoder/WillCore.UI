import { Modal } from "../bootstrapNative.js"
//Changes: cache the html so that the loading does not happen async
class bootstrapDropdown extends HTMLElement {
    constructor() {
        super();
        this.view = null;
        this.onclick = null;
        willCore["bootstrap-dropdown"].load(this);
        this.modal = null;
    }
    main(view) {
    }

    connectedCallback() {
        this.modal = new Modal(this.view.$dropdownMenuLink.element,
        { 
            content: this.view.$dropdownMenuLink.element.innerHTML, 
            backdrop: 'static', 
            keyboard: false
        });
    }

    getHTML() {
        return ``;
    }
}

export { bootstrapDropdown };