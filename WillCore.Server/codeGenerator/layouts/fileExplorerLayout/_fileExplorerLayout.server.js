var fileCreator = require("../../serverLogic/fileCreator.js");

module.exports = (view) => {
    view.createFolder = async (view) => {
        var folder = view.creationValues.itemName;
        fileCreator.createFolder(folder);
        view.done();
    };
};