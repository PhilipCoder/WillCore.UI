const indexCore = require("../../serverLogic/indexCore.js");
const fileCreateModuleLoader = require("../../fileCreation/logic/fileCreateModuleLoader.js");

module.exports = (view) => {
    view.projectExists = async (view) => {
        const viewModules = (await fileCreateModuleLoader.getProjectFileModules()).map(x => ({
            label: x.config.menuPath.split('/')[x.config.menuPath.split('/').length - 1],
            name: x.moduleName,
            icon: x.icon,
            description: x.config.description,
            optional: x.config.optional,
            priority: x.config.priority
        }));
        viewModules.sort(function (a, b) { return a.priority - b.priority })
        return { exists: new indexCore().exists, modules: viewModules };
    }
    view.initProject = (view) => {
        view.creationModules.forEach(creationModuleName => {
            fileCreateModuleLoader.modules[creationModuleName].saveFiles();
        });
        return { success: true };
    };
};