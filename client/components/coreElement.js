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
        this.viewInstance.skipFunctionImport = !!this.view;
        this.model = new Promise(async (resolve, reject) => {
            this.viewInstance.init().then(async () => {
                this.viewInstance.viewModel._noIntermediateProxy = true;
                this.innerHTML = this.viewInstance.html;//by setting the html first, the children will render first
                let slot = this.viewInstance.viewModel.$slot;
                if (slot._element) {
                    slot._element.parentCoreElement = this;
                    slot._element.innerHTML = this.originalHTML;
                }
                if (this.onLoaded) {
                    this.onLoaded();
                }
                await this.view(this.viewInstance.viewModel);
                resolve(this.viewInstance.viewModel);
            });
        });
        this.model.then((value)=>{
            this.model = value;
        });
    }
}

export { coreElement };