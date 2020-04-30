import { guid } from "../helpers/guid.js";
import { viewDomLoader } from "./viewDomLoader.js";
import { lazyImport } from "/willcore/helpers/lazyImport.js";
import { viewModelProxy } from "../proxies/viewModel/viewModelProxy.js";
import { baseRequestProxy } from "../proxies/requestProxy/baseRequestProxy.js";
class view {
    constructor(url) {
        this._viewDomLoader = new viewDomLoader();
        this.viewId = guid();
        this.url = url;
        this.parentElementId = null;
        this.layoutViewUrl = null;
        this.layoutElementId = null;
        this.viewFunction = null;
        this._children = {};
    }

    async init() {
        this.html = await this._viewDomLoader.loadView(this.url, this.viewId);
        let viewModule = await lazyImport(`/views/${this.url}.js`);
        this.layoutViewUrl = viewModule.layout;
        this.containerId = viewModule.containerId;
        this.viewFunction = viewModule.view;
        this.viewModel = viewModelProxy.new(this.viewId);
    }

    async unload() {
        //unload code goes here
    }

    async render(layoutView) {
        //code to append the html and execute the view function
        if (!layoutView) {
            document.getElementsByTagName('body')[0].innerHTML = this.html;
        } else {
            layoutView.viewModel["$" + layoutView.containerId]._element.innerHTML = this.html;
        }
        await this.viewFunction(this.viewModel, baseRequestProxy.new());
    }

    async renderIntoElement(element) {
        element.innerHTML = this.html;
        await this.viewFunction(this.viewModel);
        return this.viewModel;
    }

    async deleteChild(viewId) {
        await this._children[viewId].unload();
        delete this._children[viewId];
    }

    addChild(view) {
        this._children[view.viewId] = view;
    }

    get isLayout() {
        return !!this.containerId;
    }

    get children() {
        return this._children;
    }

    get hasLayout() {
        return !!this.layoutViewUrl;
    }
}

export { view };