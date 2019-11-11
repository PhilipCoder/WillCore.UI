const path = require('path');
const fs = require("fs");
const fileCreator = require("./fileCreator.js");

class projectFile {
    constructor() {
        this.fileName = path.resolve(__dirname, `../config/project.json`);
        this.configObj = null;
        if (fs.existsSync(this.fileName)) {
            var fileContent = fs.readFileSync(this.fileName, 'utf8');
            this.configObj = JSON.parse(fileContent);
        }
    }

    exists() {
        return !!this.configObj;
    }

    init(creationModules) {
        this.configObj = { creationModules };
        this.save();
    }

    save() {
        var json = JSON.stringify(this.configObj);
        fs.writeFileSync(this.fileName, json);
    }

    addView(viewName, fileRoute) {
        this.configObj.views = this.configObj.views || {};
        this.configObj.views[viewName] = { name: viewName, fileRoute: fileRoute, viewType: "view", linked: false, layout: null, route: null, layoutElement: null };
        this.save();
    }

    unlinkView(viewName) {
        delete this.configObj.views[viewName];
        this.save();
    }

    linkView(viewName, route, layout) {
        this.configObj.views[viewName] = this.configObj.views[viewName] || {};
        this.configObj.views[viewName].viewName = viewName;
        this.configObj.views[viewName].linked = true;
        this.configObj.views[viewName].viewType = "view";
        this.configObj.views[viewName].layout = layout;
        this.configObj.views[viewName].route = route;
        this.save();
    }

    linkLayout(viewName, layoutElement) {
        this.configObj.views[viewName] = this.configObj.views[viewName] || {};
        this.configObj.views[viewName].linked = true;
        this.configObj.views[viewName].viewName = viewName;
        this.configObj.views[viewName].viewType = "layout";
        this.configObj.views[viewName].layoutElement = layoutElement;
        this.save();
    }

    linkPartial(layout, route, layoutElement) {
        this.configObj.views[viewName].linked = true;
        this.configObj.views[viewName].viewType = "partial";
        this.configObj.views[viewName].route = null;
        this.configObj.views[viewName].layoutElement = null;
        this.save();
    }

    getView(viewName) {
        this.configObj.views = this.configObj.views || {};
        var result = this.configObj.views[viewName] || { name: null, fileRoute: null, viewType: "view", linked: false, layout: null, route: "", layoutElement: "" };
        if (result.viewType === "view" && result.layout && result.layout !== "Default") {
            result.layoutPath = `${this.configObj.views[result.layout].fileRoute}/${result.layout}.view`
        }
        else if (result.viewType === "layout") {
            var that = this;
            var childViewNames = Object.keys(this.configObj.views).filter(x => this.configObj.views[x].layout === viewName);
            result.childViews = childViewNames.map(x => ({
                viewName: x,
                viewPath: `${that.configObj.views[x].fileRoute}/${x}.view`
            }));
        }
        return result;
    }

    getLayouts() {
        return Object.keys(this.configObj.views).filter(x => this.configObj.views[x].viewType === "layout");
    }

    viewExists(viewName) {
        return this.configObj.views && this.configObj.views[viewName]
    }

    isViewLinked(viewName) {
        return this.configObj.views && this.configObj.views[viewName] && this.configObj.views[viewName].linked
    }
}

module.exports = new projectFile();