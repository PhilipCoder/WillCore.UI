class _router {
    constructor() {
        this.registeredViews = {};
        this.coreProxy = null;
        this.currentRoute = "";
        var that = this;
        var windowVar = typeof window === "undefined" ? null : window;
        this.previousUrl = null;
        this.previousViewManager = null;
        if (windowVar) {
            window.addEventListener('hashchange', event => {
                that.handleRoute(that.getUrl());
            });
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
    setCoreProxy(coreProxy) {
        this.coreProxy = coreProxy;
    }
    
    async handleRoute(url) {
        var fullURL = this.getUrl(true);
        if (fullURL != this.previousUrl) {
            this.previousUrl = fullURL;
            this.currentRoute = url;
            var viewToLoad = null;
            for (var key in this.registeredViews) {
                if (this.registeredViews[key].viewManager.route == this.currentRoute) {
                    viewToLoad = this.registeredViews[key];
                    break;
                }
            }
            if (viewToLoad) {
                if (this.previousViewManager) {
                    this.previousViewManager.unload();
                }
                viewToLoad = await willCoreModules.viewLoader.loadView(viewToLoad, this.coreProxy);
                viewToLoad.route = {};
                viewToLoad.route.url = this.getUrl();
                this.getURLParameters(viewToLoad.route);
                if (viewToLoad.viewManager.layout) {
                    viewToLoad.viewManager.layout.route.url = this.getUrl();
                    this.getURLParameters(viewToLoad.viewManager.layout.route);
                }
                this.previousViewManager = viewToLoad.viewManager;
            }
        }
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
    regiserView(view) {
        this.registeredViews[view.viewManager.name] = view;
        if (view.viewManager.route == this.currentRoute) {
            willCoreModules.viewLoader.loadView(view, this.coreProxy);
        }
    }
    init() {
        this.handleRoute(this.getUrl());
    }
}
var router = {
    getFactoryInstance: () => new _router()
}
export { router };