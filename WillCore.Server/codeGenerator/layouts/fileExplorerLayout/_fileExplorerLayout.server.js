var fileCreator = require("../../serverLogic/fileCreator.js");
var projectFile = require("../../serverLogic/projectFile.js");


module.exports = (view) => {
    view.createFolder = async (view) => {
        var folder = view.itemName;
        fileCreator.createFolder(folder);
        return true;
    };
    view.createFile = async (view) => {
        var fileName = view.itemName;
        fileCreator.createFile(fileName);
        return true;
    };
    view.createView = async (view) => {
        var fileName = view.itemName;
        fileCreator.setView(fileName);
        var name = fileName.substring(fileName.lastIndexOf("\\") + 1);
        fileName = fileName.substring(0, fileName.lastIndexOf("\\"));
        projectFile.addView(name, fileName);
        return true;
    };
};