const fileCreator = require("../../serverLogic/fileCreator.js");
const projectFile = require("../../serverLogic/projectFile.js");
const fileCreateModuleLoader = require("../../fileCreation/logic/fileCreateModuleLoader.js");

module.exports = (view) => {
    view.getFileModules = async (view) => {
        var mainFileModules = (await fileCreateModuleLoader.getMainFileModules()).map(x => ({
            label: x.config.menuPath.indexOf("/") > -1 ? x.config.menuPath.split('/')[x.config.menuPath.split('/').length - 1] : x.config.menuPath,
            path: x.config.menuPath,
            name: x.moduleName,
            folder: x.config.menuPath.indexOf("/") > -1 ? x.config.menuPath.split('/')[0] :null,
            description: x.config.description,
        }));
        return {modules:mainFileModules};
    };
    view.createModuleFile = async (view) => {
        view.itemName = view.itemName.replace("wwwRoot", "");
        fileCreateModuleLoader.modules[view.moduleName].saveFiles(view.itemName);
        return {success:true};
    };
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