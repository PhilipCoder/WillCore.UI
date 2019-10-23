class _router {
    constructor() {
        this.registeredViews = {};
        this.coreProxy = null;
        this.currentRoute = "";
        let that = this;
        let windowVar = typeof window === "undefined" ? null : window;
        this.previousUrl = null;
        this.previousViewManager = null;
        if (windowVar) {
            window.addEventListener('hashchange', event => {
                that.handleRoute(that.getUrl());
            });
        }
    }
    getUrl(returnFull) {
        let url = window.location.hash.slice(1) || "/";
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
        let fullURL = this.getUrl(true);
        if (fullURL != this.previousUrl) {
            this.previousUrl = fullURL;
            this.currentRoute = url;
            let viewToLoad = null;
            for (let key in this.registeredViews) {
                if (this.registeredViews[key].viewManager.route == this.currentRoute) {
                    viewToLoad = this.registeredViews[key];
                    break;
                }
            }
            if (viewToLoad) {
                if (this.previousViewManager) {
                    this.previousViewManager.unload();
                }
                let loadedViewInstance = await willCoreModules.viewLoader.loadView(viewToLoad, this.coreProxy);
                if (loadedViewInstance.viewManager && loadedViewInstance.viewManager.layout) {
                    viewToLoad.viewManager.layout = loadedViewInstance.viewManager.layout;
                }
                this.previousViewManager = viewToLoad.viewManager;
            }
        }
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