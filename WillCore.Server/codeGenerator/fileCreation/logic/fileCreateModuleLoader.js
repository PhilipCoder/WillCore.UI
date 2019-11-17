const pathUtil = require("../../serverLogic/pathUtil.js");
const path = require('path');
const creationModule = require("./creationModule.js");
/**
 * Loader to load all file creation modules from the plugin directory.
 * Author : Philip Schoeman
 * */
class fileCreateModuleLoader {
    loadFiles() {
        this.loadPromise = new Promise(async (resolve, reject) => {
            this.moduleDirectory = path.resolve(__dirname, "../fileTypes");
            this.modulesNames = await pathUtil.getFilesInDirectory(this.moduleDirectory);
            let modules = this.modulesNames.map(x => new creationModule(x));
            this.moduleCollection = modules;
            this.modules = {};
            this.extentionMapping = {};
            for (var i = 0; i < modules.length; i++) {
                let module = modules[i];
                await module.loadState();
                this.modules[module.moduleName] = module;
                this.extentionMapping[module.extention] = module;
            }
            resolve();
        });
    }

    async createFiles(moduleName, filePath) {
        await this.loadPromise;
        let module = this.modules[moduleName];
        module.saveFiles(filePath);

    }

    async getProjectFileModules() {
        return new Promise(async (resolve, reject) => {
            await this.loadPromise;
            resolve(Object.keys(this.modules).filter(x => this.modules[x].config.menuPath.startsWith("Project/")).map(x => this.modules[x]));
        });
    }

    async getMainFileModules() {
        return new Promise(async (resolve, reject) => {
            await this.loadPromise;
            resolve(Object.keys(this.modules).filter(x => !this.modules[x].config.menuPath.startsWith("Project/")).map(x => this.modules[x]));
        });
    }

    async getEditorModules() {
        return new Promise(async (resolve, reject) => {
            await this.loadPromise;
            let editorModules = this.moduleCollection.filter(x => x.config.editorComponents && Array.isArray(x.config.editorComponents));
            let allComponents = [];
            editorModules.forEach(module => {
                module.config.editorComponents.forEach(component => {
                    component.jsPath = pathUtil.replaceAll(path.join(module.basePath, component.js),"\\","/");
                    component.htmlPath = pathUtil.replaceAll(path.join(module.basePath, component.html), "\\", "/");
                    allComponents.push(component);
                });
            });
            resolve(allComponents);
        });
    }
}

let fileCreateModuleLoaderInstance = new fileCreateModuleLoader();

(async () => {
    fileCreateModuleLoaderInstance.loadFiles();
})();

module.exports = fileCreateModuleLoaderInstance;