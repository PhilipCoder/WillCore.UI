var fileCreator = require("../../serverLogic/fileCreator.js");
var projectFile = require("../../serverLogic/projectFile.js");


module.exports = (view) => {
    view.readFile = async (view) => {
        var fileContents = fileCreator.readFile(view.url);
        return fileContents;
    };
    view.getViewData = async (view) => {
        return projectFile.getView(view.viewName);
    };
    view.saveFile = async (view) => {
        fileCreator.saveFile(view.url, view.contents);
        return true;
    };
};