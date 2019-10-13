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
    async loadView(view, coreProxy, sender) {
        var that = this;
        return new Promise(async (mainResolve, mainReject) => {
            var viewManager = view.viewManager;
            if (viewManager.layout && that.previousLayout != viewManager.layout) {
                if (that.previousLayout && that.previousLayout.viewManager) {
                    that.previousLayout.viewManager.unload();
                }
                that.previousLayout = viewManager.layout;
                await that.loadView(viewManager.layout, coreProxy, view);
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
                willCoreModules.execptionHander.handleExeception("Unable To Load View", `The view ${viewManager.name} does not both htmlURL and jsURL defined.`);
            } else {
                if (viewManager.isLayout && sender) {
                    view._proxyTarget.child = sender;
                }
                await this.finalizeLoad(viewManager, view, mainResolve);
            }
        });
    }

    async finalizeLoad(viewManager, view, mainResolve, initialDisplay) {
        var html = await willCoreModules.loadHTML(viewManager.htmlURL, view);
        const idManagerView = viewManager.parentViewManager ? viewManager.parentViewManager : null;
        var element = typeof viewManager.element === "string" ?
            new willCoreModules.idManager(idManagerView).getElement(viewManager.element) :
            new willCoreModules.idManager(idManagerView).getElementExistingId(viewManager.element.id);
        element.innerHTML = html;
        willCoreModules.lazyImport(viewManager.jsURL).then(x => {
            if (x.view) {
                x.view(view);
            }
            mainResolve();
        });
    }
}
var viewLoader = {
    getFactoryInstance: () => new _viewLoader()
}
export { viewLoader };