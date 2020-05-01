import { view } from "../logic/view.js";

class coreElement extends HTMLElement {
    /**
     * Base constructor for a custom element
     * @param { import("./elementCreationConfig.js").elementCreation } config 
     */
    constructor(config) {
        super();
        config.validate();
        this.config = config;
        this.connected = false;
    }

    static register(name) {
        customElements.define(name, this);
    }

    connectedCallback() {
        if (this.connected) return;
        this.connected = true;
        this.originalHTML = this.innerHTML;
        this.viewInstance = new view(this.config.htmlTemplateURL);
        this.viewInstance.html = this.config.html;
        this.viewInstance.skipFunctionImport = !!this.config.viewFunction;
        this.loading = new Promise((resolve, reject) => {
            this.viewInstance.init().then(async () => {
                this.innerHTML = this.viewInstance.html;//by setting the html first, the children will render first
                this.model = this.viewInstance.viewModel;
                let slot = this.model.$slot;
                if (slot._element) {
                    slot._element.parentCoreElement = this;
                    slot._element.innerHTML = this.originalHTML;
                }
                if (this.onLoaded) {
                    this.onLoaded();
                }
                await this.config.viewFunction(this.viewInstance.viewModel);
                resolve();
            });
        });
    }
}

export { coreElement };