import { coreElement } from "/uiModules/components/coreElement.js";
import { elementCreationConfig } from "/uiModules/components/elementCreationConfig.js";

const conf = new elementCreationConfig();
conf.html = `<button id="button" style="color:white"><span id="label"></span><span id="slot"></span></button>`;

class loaderButton extends coreElement {
    constructor() {
        super(conf)
    }
    onLoaded(){
        console.log("button loaded");
    }
    async view(model){
        model.data = { clickCount: 0 };
        model.$label.bind = () => `Clicked : ${model.data.clickCount}`;
        model.$button.onclick.event = () => { model.data.clickCount++ };
        model.$button.backgroundColor.style = () => model.data.clickCount > 10 ? "red" : "blue";
    };
}

loaderButton.register("loader-button");

export { loaderButton };