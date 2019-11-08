var projectFile = require("../../serverLogic/projectFile.js");
const fileCreateModuleLoader = require("../../fileCreation/logic/fileCreateModuleLoader.js");

module.exports = (view) => {
    view.projectExists = async (view) => {
        const viewModules = await fileCreateModuleLoader.getProjectFileModules().map(x => ({
            label: x.config.menuPath.split('/')[x.config.menuPath.split('/').length - 1],
            name: x.moduleName,
            icon:x.icon
        }));
        view.projectData = { exists: projectFile.exists() };
        view.done();
    }
    view.initProject = (view) => {
        projectFile.init(view.projectSettings.useBootstrap, view.projectSettings.useIndexFile, view.projectSettings.useDefaultCSS);
        view.done();
    };
};