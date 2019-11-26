const projectFile = require("../../../../../serverLogic/projectFile.js");
const indexCore = require("../../../../../serverLogic/indexCore.js");
const projectConstants = require("../../../../../config/projectConstants.js");
const pathUtil = require("../../../../../serverLogic/pathUtil.js");
const path = require("path");
const index = new indexCore();

module.exports = (view) => {
    view.getViewData = async (view) => {
        let allIndexComponents = index.linkedAssignables;
        let components = allIndexComponents.components.filter(x => x.name == view.viewName);
        let result = { name: null, viewType: "component", linked: false };
        if (components.length > 0) {
            let component = components[0];
            result = { name: component.name, viewType: "component", linked: true };
        }
        return result;
    };
    view.linkLayout = (view) => {
        //validations
        if (index.assignableExists(view.viewName)) {
            return `An assignable with name ${view.viewName} is already binded in the index file!`;
        }
        let baseRoute = view.viewPath.substring(0, view.viewPath.indexOf("."));
        baseRoute = baseRoute.replace("wwwRoot", "");
        let jsRoute = baseRoute + ".js";
        let htmlRoute = baseRoute + ".html";
        let result = index.addLayout(view.layoutName, htmlRoute, jsRoute);
        if (result.message) return result.message;
        return true;
    };
    view.unlinkView = (view) => {
        let allIndexComponents = index.linkedAssignables;
        let layouts = allIndexComponents.layouts.filter(x => x.name == view.viewName);
        if (layouts.length > 0 && allIndexComponents.views.filter(x => x.layout === view.viewName).length > 0) {
            return "Unable to unlink layout view. There are views using it as a layout. Unlink the dependant views first.";
        } else {
            index.removeAssignable(view.viewName);
        }
        return true;
    };
};