const pathUtil = require("../../serverLogic/pathUtil.js");
const path = require('path');
const creationModule = require("./creationModule.js");
/**
 * Loader to load all file creation modules from the plugin directory.
 * Author : Philip Schoeman
 * */
class fileCreateModuleLoader {
    async loadFiles() {
        this.moduleDirectory = path.resolve(__dirname, "../fileTypes");
        this.modulesNames = await pathUtil.getFilesInDirectory(this.moduleDirectory);
        this.modules = this.modulesNames.map(x => new creationModule(x));
    }
}

let fileCreateModuleLoaderInstance = new fileCreateModuleLoader();
fileCreateModuleLoaderInstance.loadFiles();

module.exports = fileCreateModuleLoaderInstance;