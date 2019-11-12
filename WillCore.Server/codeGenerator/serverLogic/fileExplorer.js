const fs = require('fs');
const path = require('path');
const fileCreateModuleLoader = require("../fileCreation/logic/fileCreateModuleLoader.js");

class fileExplorer {
    constructor(directory) {
        directory = path.resolve(__dirname, "..\\..\\", directory);
        this.directory = directory;
    }
    async getFiles() {
        //To remove files that are part of an aggragation and insert a single filename
        //Get all the file names that are part of aggragation:
        //a) all templates should have "fileName" as the part that needs to be replaced.
        //b) group all files with the first part of the filename if it has more than one ".", groupings should be in an array;
        //c) run the groupings against the plugins and check if any of the extentions' last parts of the templates match all to the groups last parts
        //d) if it does not match, mark the grouping as removed.
        //e) if it does match, mark the files as removed from the main list of files, 
        //   replace the files in the grouping with the single file with the first part and extension: { name: myView.view, icon: "icon" }
        //f) run through the list of files that are not marked as deleted and load their icons, if not found default icon
        //g) join the two lists of files and return.
        return new Promise(async (resolve, reject) => {
            let files = await this.readFilesInDirectory(this.directory);
            let fileNameGroupings = {};
            files.forEach((file) => {
                let fileParts = file.split(".");
                if (fileParts.length > 2) {
                    let index = 0;
                    let fileLastPart = fileParts.filter(filePart => (index++) > 0).join(".");
                    let fileName = fileParts[0];
                    fileNameGroupings[fileName] = fileNameGroupings[fileName] || { deleted: true, files: [] };
                    fileNameGroupings[fileName].files.push(fileLastPart);
                } else if (fileParts.length === 2) {
                    let index = 0;
                    let fileLastPart = fileParts[1];
                    let fileName = fileParts[0];
                    fileNameGroupings[fileName] = fileNameGroupings[fileName] || { deleted: true, files: [] };
                    fileNameGroupings[fileName].files.push(fileLastPart);
                }
            });

            let pluginModules = fileCreateModuleLoader.modules;
            let moduleNames = Object.keys(pluginModules);
            let aggregrationModules = moduleNames.
                filter(x => pluginModules[x].config.showSingleFile).
                map(x => pluginModules[x]);
            let simpleModules = moduleNames.
                filter(x => !pluginModules[x].config.showSingleFile).
                map(x => pluginModules[x]);

            Object.keys(fileNameGroupings).forEach(grouping => {
                //unmark groupings that have template definitions
                let matchedPlugins = aggregrationModules.filter(
                    module => {
                        return module.templateFileDefinitions.filter(
                            templateDefinition => fileNameGroupings[grouping].files.indexOf(templateDefinition) > -1
                        ).length === module.templateFileDefinitions.length;
                    });
                if (matchedPlugins.length > 0) {
                    fileNameGroupings[grouping].deleted = false;
                    fileNameGroupings[grouping].files.forEach(groupingFile => {
                        files[files.indexOf(`${grouping}.${groupingFile}`)] = null;
                    });
                    files.push({ file: `${grouping}${matchedPlugins[0].extention}`, icon: matchedPlugins[0].icon });
                }
            });

            let icons = {};
            simpleModules.forEach(simpleModule => {
                if (simpleModule.icon !== undefined || simpleModule.icon !== null) {
                    let extention = simpleModule.extention === "" ? "folder" : simpleModule.extention;
                    icons[extention] = simpleModule.icon;
                }
            });
            files = files.filter(x => !!x);

            var that = this;
            for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
                let file = files[fileIndex];
                if (typeof file === "string") {
                    files[fileIndex] = { file: file, icon: icons[path.extname(file) === "" ? "folder" : path.extname(file)] }
                }
            }

            let displayFiles = files.filter(x=>!!x).map(file => ({
                path: path.resolve(that.directory, file.file),
                fileName: path.basename(file.file),
                fileNameWithExtension: file.file,
                icon: file.icon,
                fileExtention: path.extname(file.file)
            }));

            resolve(displayFiles);
        });
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