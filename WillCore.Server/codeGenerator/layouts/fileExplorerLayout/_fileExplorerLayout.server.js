const fileCreator = require("../../serverLogic/fileCreator.js");
const projectFile = require("../../serverLogic/projectFile.js");


module.exports = (view) => {
    view.createFolder = async (view) => {
        var folder = view.itemName;
        return fileCreator.createFolder(folder);
    };
    view.createFile = async (view) => {
        var fileName = view.itemName;
        return fileCreator.createFile(fileName);
    };
    view.createView = async (view) => {
        var fileName = view.itemName;
        var name = fileName.substring(fileName.lastIndexOf("\\") + 1);
        if (projectFile.viewExists(name)) {
            return false;
        }
        fileCreator.setView(fileName);
        fileName = fileName.substring(0, fileName.lastIndexOf("\\"));
        projectFile.addView(name, fileName);
        return true;
    };
};