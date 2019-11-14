const fs = require('fs');
const path = require('path');
const fileCreateModuleLoader = require("../fileCreation/logic/fileCreateModuleLoader.js");
const fileEditingModuleLoader = require("../fileEditing/logic/fileEditingModuleLoader.js");

class fileExplorer {
    constructor(directory) {
        directory = path.resolve(__dirname, "..\\..\\", directory);
        this.directory = directory;
    }
    async getFiles() {
        return new Promise(async (resolve, reject) => {
            let files = await this.getFileObjects();

            let displayFiles = files.filter(x=>!!x).map(file => ({
                path: path.resolve(this.directory, file.file),
                fileName: path.basename(file.file),
                fileNameWithExtension: file.file,
                icon: file.icon,
                fileEditorPath: file.fileEditorPath,
                fileExtention: path.extname(file.file)
            }));

            resolve(displayFiles);
        });
    }

    getFileObjects() {
        return new Promise(async (resolve, reject) => {
            let files = await this.readFilesInDirectory(this.directory);
            let fileNameGroupings = this.getFileNameGroupings(files);
            let pluginModules = fileCreateModuleLoader.modules;
            let moduleNames = Object.keys(pluginModules);
            let simpleModules = moduleNames.
                filter(x => !pluginModules[x].config.showSingleFile).
                map(x => pluginModules[x]);
            this.handleAggragatedFiles(moduleNames, pluginModules, fileNameGroupings, files);
            let icons = {};
            simpleModules.forEach(simpleModule => {
                if (simpleModule.icon !== undefined || simpleModule.icon !== null) {
                    let extention = simpleModule.extention === "" ? "folder" : simpleModule.extention;
                    icons[extention] = simpleModule.icon;
                }
            });
            files = files.filter(x => !!x);
            this.applySimpleFileIcons(files, icons);
            resolve(files);
        });
    }

    applySimpleFileIcons(files, icons) {
        let fileEditorExtentionAssociations = fileEditingModuleLoader.extentionMapping;
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            let file = files[fileIndex];
            if (typeof file === "string") {
                files[fileIndex] = { file: file, icon: icons[path.extname(file) === "" ? "folder" : path.extname(file)] };
            }
            file = files[fileIndex].file;
            if (file.indexOf(".") > -1) {
                files[fileIndex].fileEditorPath = fileEditorExtentionAssociations[path.extname(file)] ? fileEditorExtentionAssociations[path.extname(file)].config.route : fileEditorExtentionAssociations["_"].config.route;
            }
        }
    }

    handleAggragatedFiles(moduleNames, pluginModules, fileNameGroupings, files) {
        let aggregrationModules = moduleNames.
            filter(x => pluginModules[x].config.showSingleFile).
            map(x => pluginModules[x]);
        Object.keys(fileNameGroupings).forEach(grouping => {
            let matchedPlugins = aggregrationModules.filter(module => {
                //check that all the grouping files count
                return fileNameGroupings[grouping].files.filter(groupFile => module.templateFileDefinitions.indexOf(groupFile) > -1).length === module.templateFileDefinitions.length
                    && fileNameGroupings[grouping].files.length === module.templateFileDefinitions.length;
             //   return module.templateFileDefinitions.filter(templateDefinition => fileNameGroupings[grouping].files.indexOf(templateDefinition) > -1).length === module.templateFileDefinitions.length;
            });
            if (matchedPlugins.length > 0) {
                fileNameGroupings[grouping].deleted = false;
                fileNameGroupings[grouping].files.forEach(groupingFile => {
                    files[files.indexOf(`${grouping}.${groupingFile}`)] = null;
                });
                files.push({ file: `${grouping}${matchedPlugins[0].extention}`, icon: matchedPlugins[0].icon });
            }
        });
    }

    getFileNameGroupings(files) {
        let fileNameGroupings = {};
        files.forEach((file) => {
            let fileParts = file.split(".");
            if (fileParts.length > 2) {
                let index = 0;
                let fileLastPart = fileParts.filter(filePart => (index++) > 0).join(".");
                let fileName = fileParts[0];
                fileNameGroupings[fileName] = fileNameGroupings[fileName] || { deleted: true, files: [] };
                fileNameGroupings[fileName].files.push(fileLastPart);
            }
            else if (fileParts.length === 2) {
                let index = 0;
                let fileLastPart = fileParts[1];
                let fileName = fileParts[0];
                fileNameGroupings[fileName] = fileNameGroupings[fileName] || { deleted: true, files: [] };
                fileNameGroupings[fileName].files.push(fileLastPart);
            }
        });
        return fileNameGroupings;
    }

    readFilesInDirectory(directory) {
        return new Promise((resolve, reject) => {
            fs.readdir(directory, function (err, files) {
                if (err) {
                    reject();
                }
                resolve(files);
            });
        });
    }

}

module.exports = fileExplorer;