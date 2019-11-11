class viewManager {
    constructor(name) {
        this.jsURL = null;
        this.htmlURL = null;
        this.route = null;
        this.routeAuthFunc = null;
        this.name = name;
        this.element = null;
        this.proxy = null;
        this.layout = null;
        this.collectionManager = new willCoreModules.collectionManager();
        this.collectionManager.viewManager = this;
        this.bindingMangager = new willCoreModules.bindingMangager();
        this.isLayout = false;
        this.childViews = [];
        this.onUnloadEvent = null;
    }

    copyTo(target) {
        target.jsURL = this.jsURL;
        target.htmlURL = this.htmlURL;
        target.route = this.route;
        target.routeAuthFunc = this.routeAuthFunc;
        target.name = this.name;
        target.layout = this.layout;
        target.isLayout = this.isLayout;
        target.childViews = this.childViews;
        target.onUnloadEvent = this.onUnloadEvent;
        target.element = this.element;
        target.forceElement = this.forceElement;
        target.parentViewManager = this.parentViewManager;
    }

    async setUrl(url) {
        url = url.string[0];
        if (url.endsWith(".js")) {
            this.jsURL = url;
        } else {
            this.htmlURL = url;
        }
    }

    unload() {
        this.collectionManager.clear(this.proxy);
        this.bindingMangager.clear();
        if (this.onUnloadEvent) {
            this.onUnloadEvent();
        }
        this.childViews.forEach(childView => { childView.unload(); });
    }

    setRoute(route, view) {
        this.route = route.string[0];
        this.routeAuthFunc = route.function[0];
        willCoreModules.router.regiserView(view);
    }
}

export { viewManager };