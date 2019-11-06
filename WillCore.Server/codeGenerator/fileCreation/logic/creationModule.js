const path = require('path');
const fs = require('fs');
const pathUtil = require("../../serverLogic/pathUtil.js");
/**
 * Validations to validate that the JSON configuration of the module has the correct fields.
 * */
let jsonFieldValidation = {
    extention: value => typeof value === "string" && value.length > 1 && value.startsWith("."),
    showSingleFile: value => typeof value === "boolean",
    icon: value => typeof value === "string" && value.endsWith(".png"),
    menuPath: value => value && typeof value === "string" && value.length > 1
};

/**
 * Loads a file creation module.
 * 
 * Author: Philip Schoeman
 * */

class creationModule {
    /**
     * Loads the module by name from the fileTypes directory
     * 
     * @param {string} moduleName The name of the module, excluding directory path.
     */
    constructor(moduleName) {
        this.loadState(moduleName);
    }

    async loadState(moduleName) {
        this.moduleName = moduleName;
        let modulePath = path.resolve(__dirname, "../fileTypes/", moduleName);
        this.config = require(path.resolve(modulePath, "config.json"));
        this.validateConfig();
        this.preProcessor = require(`../fileTypes/${moduleName}/preProcessor.js`);
        this.finalizer = require(`../fileTypes/${moduleName}/finalizer.js`);
        this.icon = `/codeGen/fileCreation/fileTypes/${moduleName}/${this.config.icon}`;
        this.extention = this.config.extention;
        this.showSingleFile = this.config.showSingleFile;
        this.menuPath = this.config.menuPath;
        this.templateFiles = await pathUtil.getFilesInDirectory(path.resolve(modulePath, "templates"));
        this.templateFilePaths = this.templateFiles.map(x => path.resolve(modulePath, "templates", x));
    }

    saveFiles() {
        //Todo continue here
        this.templateFilePaths.map(x => this.preProcessor.processFile();
    }

    /**
     * @private
     * */
    validateConfig() {
        if (!this.config || typeof this.config !== "object") {
            throw `Invalid JSON configuration for file creation module ${this.name}`;
        }
        for (var key in jsonFieldValidation) {
            if (!jsonFieldValidation[key](this.config[key])) {
                throw `Plugin ${this.moduleName} has an invalid config. The config has an invalid field ${key}.`;
            }
        }
    }
}

module.exports = creationModule;