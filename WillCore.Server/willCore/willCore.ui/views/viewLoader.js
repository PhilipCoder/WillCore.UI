import { lazyImport } from "../helpers/lazyImport.js";
import { execptionHander } from "../helpers/exceptionHander.js";
import { layout } from "../assignables/bindables/layout.js";
import { loadHTML } from "./htmlLoader.js";
import { idManager } from "./idManager.js";

class _viewLoader {
    constructor() {
        this.previousLayout = null;
        this.defaultLayoutHTML = null;
        this.previousPage = null;
        this.bodyElement = document.getElementsByTagName("BODY")[0];
        this.bodyElement.id = !this.bodyElement.id || this.bodyElement.id === "" ? "CoreHTMLBody" : this.bodyElement.id;
        this.isDefaultLayout = true;
        if (this.defaultLayoutHTML === null) {
            this.defaultLayoutHTML = this.bodyElement.innerHTML;
        }
    }
    async loadView(view, coreProxy,initialDisplay) {
        var that = this;
        return new Promise(async (mainResolve, mainReject) => {
            var viewManager = view.viewManager;
            if (viewManager.layout && that.previousLayout != viewManager.layout) {
                that.previousLayout = viewManager.layout;
                await that.loadView(viewManager.layout, coreProxy);
                that.isDefaultLayout = false;
            } else if (!viewManager.layout && !viewManager.isLayout && !view._isPartial) {
                that.bodyElement.innerHTML = this.defaultLayoutHTML;
                that.isDefaultLayout = true;
                that.previousLayout = null;
            } else {
                that.isDefaultLayout = false;
            }
            if (typeof viewManager.routeAuthFunc === "function") {
                var authenticated = viewManager.routeAuthFunc();
                if (authenticated.then) {
                    authenticated = await authenticated;
                }
                if (!authenticated) {
                    window.location.hash = "/";
                    return;
                }
            }
            if (!viewManager.htmlURL || !viewManager.jsURL) {
                execptionHander.handleExeception("Unable To Load View", `The view ${viewManager.name} does not both htmlURL and jsURL defined.`);
            } else {
                await this.finalizeLoad(viewManager, view, mainResolve);
            }
        });
    }

    async finalizeLoad(viewManager, view, mainResolve, initialDisplay) {
        var html = await loadHTML(viewManager.htmlURL, view);
        const idManagerView = viewManager.parentViewManager ? viewManager.parentViewManager : null;
        var element = typeof viewManager.element === "string" ?
            new idManager(idManagerView).getElement(viewManager.element) :
            new idManager(idManagerView).getElementExistingId(viewManager.element.id);
        element.innerHTML = html;
        lazyImport(viewManager.jsURL).then(x => {
            if (x.view) {
                x.view(view);
            }
            mainResolve();
        });
    }
}
var viewLoader = new _viewLoader();
export { viewLoader };