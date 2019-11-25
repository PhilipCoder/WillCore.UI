var fileExplorer = require("../../serverLogic/fileExplorer.js");
var fileEditingModuleLoader = require("../../fileEditing/logic/fileEditingModuleLoader.js");

module.exports = (view) => {
    view.getFiles = async (view) => {
        var fileExplorerInstance = new fileExplorer(view.route.route);
        var files = await fileExplorerInstance.getFiles();
        return files;
    };
};