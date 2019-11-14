const fileCreator = require("../../../serverLogic/fileCreator.js");
const projectFile = require("../../../serverLogic/projectFile.js");


module.exports = (view) => {
    view.readFile = async (view) => {
        var fileContents = fileCreator.readFile(view.url);
        return fileContents;
    };
    view.getViewData = async (view) => {
        return projectFile.getView(view.viewName);
    };
    view.getLayoutViews = async (view) => {
        return projectFile.getLayouts();
    };
    view.saveFile = async (view) => {
        fileCreator.saveFile(view.url, view.contents);
        return true;
    };
    view.linkLayout = (view) => {
        projectFile.linkLayout(view.layoutName, view.layoutElement);
        fileCreator.linkLayout(view.layoutName, view.viewPath, view.layoutElement);
        return true;
    };
    view.linkView = (view) => {
        projectFile.linkView(view.viewName, view.viewRoute, view.viewLayout);
        var layoutElement = view.viewLayout === "Default" ? view.layoutElement : projectFile.getView(view.viewLayout).layoutElement;
        fileCreator.linkView(view.viewName, view.viewPath, view.viewLayout, layoutElement, view.viewRoute);
        return true;
    };
    view.unlinkView = (view) => {
        projectFile.unlinkView(view.viewName);
        return true;
    };
};