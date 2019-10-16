var fileCreator = require("../../serverLogic/fileCreator.js");

module.exports = (view) => {
    view.createFolder = async (view) => {
        var folder = view.itemName;
        fileCreator.createFolder(folder);
        return true;
    };
  
};