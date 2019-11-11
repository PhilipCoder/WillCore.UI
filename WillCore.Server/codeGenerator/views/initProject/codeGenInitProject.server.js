var projectFile = require("../../serverLogic/projectFile.js");
const fileCreateModuleLoader = require("../../fileCreation/logic/fileCreateModuleLoader.js");

module.exports = (view) => {
    view.projectExists = async (view) => {
        const viewModules = (await fileCreateModuleLoader.getProjectFileModules()).map(x => ({
            label: x.config.menuPath.split('/')[x.config.menuPath.split('/').length - 1],
            name: x.moduleName,
            icon: x.icon,
            description: x.config.description,
            optional: x.config.optional
        }));
        return { exists: projectFile.exists(), modules: viewModules };
    }
    view.initProject = (view) => {
        projectFile.init(view.creationModules);
        view.creationModules.forEach(creationModuleName => {
            fileCreateModuleLoader.modules[creationModuleName].saveFiles();
        });
        return { success: true };
    };
};