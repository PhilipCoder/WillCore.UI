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

    view.validateName = async (view) => {
        return fileCreateModuleLoader.modules[view.moduleName].preProcessor.validateName(view.itemName);
    };
};