const projectFile = require("../../../../../serverLogic/projectFile.js");
const indexCore = require("../../../../../serverLogic/indexCore.js");
const projectConstants = require("../../../../../config/projectConstants.js");
const pathUtil = require("../../../../../serverLogic/pathUtil.js");
const path = require("path");
const index = new indexCore();

module.exports = (view) => {
    view.getViewData = async (view) => {
        let allIndexComponents = index.linkedAssignables;
        let views = allIndexComponents.views.filter(x => x.name == view.viewName);
        let layouts = allIndexComponents.layouts.filter(x => x.name == view.viewName);
        let result = { name: null, viewType: "view", layout: "Default", layoutElement: null, linked: false, route:"" };
        if (views.length > 0) {
            let view = views[0];
            result = { name: view.name, viewType: "view", layout: null, layoutElement: view.element, linked: true, route: view.route };
            if (view.layout) {
                result.layout = view.layout;
                let viewLayout = allIndexComponents.layouts.filter(x => x.name === view.layout);
                if (viewLayout.length > 0) {
                    viewLayout = viewLayout[0];
                    let layoutPath = viewLayout.htmlUrl;
                    layoutPath = "wwwRoot"+layoutPath.substring(0,layoutPath.indexOf("."))+".view";
                    result.layoutPath = layoutPath;
                }
            }
        } else if (layouts.length > 0) {
            let layout = layouts[0];
            result = { name: layout.name, viewType: "layout", layout: null, layoutElement: null, linked: true, childViews: allIndexComponents.views.filter(x => x.layout === view.viewName).map(x => ({ viewName: x.name, viewPath:"wwwRoot"+ x.htmlUrl.substring(0,x.htmlUrl.indexOf(".")) + ".view" }))  };
        }
        return result;
    };
    view.getLayoutViews = async (view) => {
        return index.linkedAssignables.layouts.map(x=>x.name);
    };
    view.linkLayout = (view) => {
        //validations
        if (index.assignableExists(view.viewName)) {
            return `An assignable with name ${view.viewName} is already binded in the index file!`;
        }
        let baseRoute = view.viewPath.substring(0,view.viewPath.indexOf("."));
        baseRoute = baseRoute.replace("wwwRoot", "");
        let jsRoute = baseRoute + ".js";
        let htmlRoute = baseRoute + ".html";
        let result = index.addLayout(view.layoutName, htmlRoute, jsRoute);
        if (result.message) return result.message;
        return true;
    };
    view.linkView = (view) => {
        //validations
        if (index.assignableExists(view.viewName)) {
            return `An assignable with name ${view.viewName} is already binded in the index file!`;
        }
        if (index.linkedAssignables.views.filter(x => x.route === view.viewRoute).length > 0) {
            return `An existing view with route ${view.viewRoute} is already binded in the index file!`;
        }
        let baseRoute = view.viewPath.substring(0, view.viewPath.indexOf("."));
        baseRoute = baseRoute.replace("wwwRoot", "");
        let jsRoute = baseRoute + ".js";
        let htmlRoute = baseRoute + ".html";
        let result = null;
        if (view.viewLayout === "Default") {
            result = index.addView(view.viewName, view.layoutElement, jsRoute, htmlRoute, view.viewRoute);
        } else {
            result = index.addViewWithLayout(view.viewName, view.layoutElement, jsRoute, htmlRoute, view.viewRoute, view.viewLayout);
        }
        if (result.message) return result.message;
        return true;
    };
    view.unlinkView = (view) => {
        index.removeAssignable(view.viewName);
        return true;
    };
    view.getLayoutHTML = async (view) => {
        let htmlPath;
        if (view.layoutName === "Default") {
            htmlPath = path.resolve(pathUtil.getWWWRootDir(), "index.html");
        } else {
            let layout = index.linkedAssignables.layouts.filter(x => x.name == view.layoutName)[0];
            htmlPath = path.join(pathUtil.getWWWRootDir(), layout.htmlUrl);
        }
        let html = await fileHelper.readFile(htmlPath);
        return html;
    }
};