var fileCreator = require("../../serverLogic/fileCreator.js");

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
        return true;
    };
};