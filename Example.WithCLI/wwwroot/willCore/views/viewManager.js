import { router } from "../views/router.js";
import { idManager } from "../views/idManager.js";
import { collectionManager } from "../binding/CollectionManager.js";
import { bindingMangager } from "../binding/bindingManager.js";

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
        this.collectionManager = new collectionManager();
        this.collectionManager.viewManager = this;
        this.bindingMangager = new bindingMangager();
        this.isLayout = false;
        this.childViews = [];
        this.onUnloadEvent = null;
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
        router.regiserView(view);
    }
}

export { viewManager };