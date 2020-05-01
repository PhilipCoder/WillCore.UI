import { coreElement } from "/uiModules/components/coreElement.js";
import { elementCreationConfig } from "/uiModules/components/elementCreationConfig.js";

const conf = new elementCreationConfig();
conf.html = `<button id="button"><span id="label"></span><span id="slot"></span></button>`;
conf.viewFunction = (model) => {
    model.data = { clickCount: 0 };
    model.$label.bind = () => `Clicked : ${model.data.clickCount}`;
    model.$button.onclick.event = () => { model.data.clickCount++ };
};

class loaderButton extends coreElement {
    constructor() {
        super(conf)
    }
    onLoaded(){
        console.log("button loaded");
    }
}

loaderButton.register("loader-button");

export { loaderButton };