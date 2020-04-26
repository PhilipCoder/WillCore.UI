import { view } from "./view.js";

class viewLoader {
    constructor() {
        this.loadedLayout = null;
        this.loadedView = null;
    }

    /**Adds a view to view Tree
     * 
     * @param {string} viewUrl 
     */
    async renderView(viewUrl) {
        let viewToLoad = new view(viewUrl);
        await viewToLoad.init(viewToLoad.viewId);
        await this._unloadViews(viewToLoad);
        await this._renderLayout(viewToLoad);
        await viewToLoad.render(this.loadedLayout);
        this.loadedView = viewToLoad;
    }

    async _renderLayout(viewToLoad){
        if (viewToLoad.hasLayout && (!this.loadedLayout || this.loadedLayout.url !== viewToLoad.layoutViewUrl)) {
            this.loadedLayout = new view(viewToLoad.layoutViewUrl);
            await this.loadedLayout.init()
            await this.loadedLayout.render();
        }
    }

    async _unloadViews(viewToLoad) {
        if (viewToLoad.hasLayout && (this.loadedLayout && this.loadedLayout.url !== viewToLoad.layoutViewUrl)) {
            await this.loadedLayout.unload();
        } else if (this.loadedView) {
            await this.loadedView.unload();
        }
    }
}

export { viewLoader };