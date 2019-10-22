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
    getViewCopy(proxy) {
        var viewProxy = willCoreModules.viewFactory.getView(proxy._proxyTarget.viewManager.name, proxy._proxyTarget.viewManager.coreProxy);
        proxy._proxyTarget.viewManager.copyTo(viewProxy._proxyTarget.viewManager);
        viewProxy._proxyTarget.viewManager.id = new Date().getTime();
        viewProxy._proxyTarget._isPartial = proxy._proxyTarget._isPartial;
        return viewProxy;
    }
    async loadView(view, coreProxy, sender, keepOriginal) {
        var that = this;
        return new Promise(async (mainResolve, mainReject) => {
            view = keepOriginal ? view : that.getViewCopy(view);
            var viewManager = view.viewManager;
            if (viewManager.layout && (!that.previousLayout || that.previousLayout.viewManager.id != viewManager.layout.viewManager.id)) {
                if (that.previousLayout && that.previousLayout.viewManager.unload) {
                    that.previousLayout.viewManager.unload();
                }
                that.previousLayout = viewManager.layout;
                var loadedLayoutInstance = await that.loadView(viewManager.layout, coreProxy, view);
                view.viewManager.layout = loadedLayoutInstance;
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
                that.applyRoutingValues(view);
            }
        });
    }

    applyRoutingValues(view) {
        view.route = view.route || {};
        view.route.url = this.getUrl();
        this.getURLParameters(view.route);
        if (view.viewManager.layout) {
            view.viewManager.layout.route.url = this.getUrl();
            this.getURLParameters(view.viewManager.layout.route);
        }
    }

    getUrl(returnFull) {
        var url = window.location.hash.slice(1) || "/";
        if (returnFull) return url;
        if (url.indexOf("?") > -1) {
            url = url.substring(0, url.indexOf("?"));
        }
        return url;
    }

    getURLParameters(objectToAssignTo) {
        var url = window.location.hash.slice(1) || "/";
        if (url.indexOf("?") > -1) {
            url = url.substring(url.indexOf("?") + 1);
        } else {
            return;
        }
        var urlParameters = url.split("&");
        urlParameters.forEach(parameter => {
            var segments = parameter.split("=");
            if (segments.length !== 2) {
                willCoreModules.execptionHander.handleExeception("Invalid URL parameters", `Unable to parse the current URL to any meaningful values.`);
            }
            objectToAssignTo[segments[0]] = decodeURIComponent(segments[1]);
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
            mainResolve(view);
        });
    }
}
var viewLoader = {
    getFactoryInstance: () => new _viewLoader()
}
export { viewLoader };