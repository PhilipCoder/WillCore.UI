import { view } from "./view.js";

class viewLoader {
    constructor(parentProxy) {
        this.loadedLayout = null;
        this.loadedView = null;
        this.parentProxy = parentProxy;
    }

    /**Adds a view to view Tree
     * 
     * @param {string} viewUrl 
     */
    async renderView(viewUrl) {
        let viewToLoad = new view(viewUrl);
        await viewToLoad.init(this.parentProxy);
        if (viewToLoad.access !== true) return viewToLoad.access;
        await this._unloadViews(viewToLoad);
        let access = await this._renderLayout(viewToLoad);
        if (access === true) {
            await viewToLoad.render(this.loadedLayout);
            this.loadedView = viewToLoad;
        }
        return access;
    }

    async _renderLayout(viewToLoad) {
        if (viewToLoad.hasLayout && (!this.loadedLayout || this.loadedLayout.url !== viewToLoad.layoutViewUrl)) {
            this.loadedLayout = new view(viewToLoad.layoutViewUrl);
            await this.loadedLayout.init(this.parentProxy)
            if (this.loadedLayout.access) {
                await this.loadedLayout.render();
            }
            return this.loadedLayout.access;
        }
        return true;
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