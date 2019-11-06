const pathUtil = require("../../serverLogic/pathUtil.js");
const path = require('path');
const creationModule = require("./creationModule.js");
/**
 * Loader to load all file creation modules from the plugin directory.
 * Author : Philip Schoeman
 * */
class fileCreateModuleLoader {
    loadFiles() {
        return new Promise(async (resolve, reject) => {
            this.moduleDirectory = path.resolve(__dirname, "../fileTypes");
            this.modulesNames = await pathUtil.getFilesInDirectory(this.moduleDirectory);
            let modules = this.modulesNames.map(x => new creationModule(x));
            this.modules = {};
            for (var i = 0; i < modules.length; i++) {
                let module = modules[i];
                await module.loadState();
                this.modules[module.moduleName] = module;
            }
            resolve();
        });
    }

    createFiles(moduleName, filePath) {
        let module = this.modules[moduleName];
        module.saveFiles(filePath);
    }
}

let fileCreateModuleLoaderInstance = new fileCreateModuleLoader();

(async () => {
    await fileCreateModuleLoaderInstance.loadFiles();
    fileCreateModuleLoaderInstance.createFiles("view","test");
})();

module.exports = fileCreateModuleLoaderInstance;