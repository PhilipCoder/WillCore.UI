const pathUtil = require("../../serverLogic/pathUtil.js");
const path = require('path');

/**
 * Loader to load all the file editing views from the plugin directory.
 * Author: Philip Schoeman
 * */
class fileEditingModuleLoader {
    loadFiles() {
        this.loadPromise = new Promise(async (resolve, reject) => {
            this.moduleDirectory = path.resolve(__dirname, "../views");
            this.modulesNames = await pathUtil.getFilesInDirectory(this.moduleDirectory);
            let modules = this.modulesNames.map(modulePath => ({
                moduleFullPath: path.resolve(this.moduleDirectory, modulePath),
                moduleFolderName: modulePath,
                config: require(`../views/${modulePath}/config.json`)

            }));
            modules.forEach(module => {
                module.jsPath = `/codeGen/fileEditing/views/${module.moduleFolderName}/${module.config.viewName}.js`;
                module.htmlPath = `/codeGen/fileEditing/views/${module.moduleFolderName}/${module.config.viewName}.html`;
                module.name = module.config.viewName;
            });
            this.modules = modules;
            this.extentionMapping = {};
            this.modules.forEach(module => {
                module.config.supportedFileTypes.forEach(fileType => {
                    this.extentionMapping[fileType] = module;
                });
            });
            resolve();
        });
    }
}

let fileEditingModuleLoaderInstance = new fileEditingModuleLoader();

(async () => {
    fileEditingModuleLoaderInstance.loadFiles();
})();

module.exports = fileEditingModuleLoaderInstance;