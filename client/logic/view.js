import { guid } from "../helpers/guid.js";
import { viewDomLoader } from "./viewDomLoader.js";
import { lazyImport } from "/willcore/helpers/lazyImport.js";
import { viewModelProxy } from "../proxies/viewModel/viewModelProxy.js";
import { baseRequestProxy } from "../proxies/requestProxy/baseRequestProxy.js";
import { willcoreUIInstance } from "../assignables/uiAssignable.js";

class view {
    constructor(url) {
        this._viewDomLoader = new viewDomLoader();
        this.viewId = guid();
        this.url = url;
        this.html = null;
        this.parentElementId = null;
        this.layoutViewUrl = null;
        this.layoutElementId = null;
        this.viewFunction = null;
        this.skipFunctionImport = false;
        this.access = true;
        this._children = {};
        this.parentProxy = null;
    }

    async init(parentProxy) {
        this.html = await this._viewDomLoader.loadView(this.url, this.viewId, this.html);
        this.viewModel = viewModelProxy.new(this.viewId);
        if (!this.skipFunctionImport) {
            let viewModule = await lazyImport(`/views/${this.url}.js`);
            this.layoutViewUrl = viewModule.layout;
            this.containerId = viewModule.containerId;
            this.viewFunction = viewModule.view;
            this.access = viewModule.access && typeof viewModule.access === "function" ? await viewModule.access(parentProxy, baseRequestProxy.new()) : this.access;
        }
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
        await this.viewFunction(this.viewModel, willcoreUIInstance, baseRequestProxy.new());
    }

    async renderIntoElement(element, viewFunction) {
        element.innerHTML = this.html;
        await (viewFunction || this.viewFunction)(this.viewModel, willcoreUIInstance, baseRequestProxy.new());
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