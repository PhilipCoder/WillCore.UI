const fs = require('fs');
const path = require('path');
const fileCreateModuleLoader = require("../../fileCreation/logic/fileCreateModuleLoader.js");

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
                    let fileLastPart = fileParts.filter(filePart => (index++) > 1).join(".");
                    let fileName = fileParts[0];
                    obj[fileName] = obj[fileName] || { deleted: false, files: [] };
                    obj[fileName].files.push(fileLastPart);
                }
            });

            let pluginModules = fileCreateModuleLoader.modules;
            let moduleNames = Object.keys(pluginModules);
            let aggregrationModules = moduleNames.
                filter(x => pluginModules[x].config.showSingleFile).
                map(x => pluginModules[x]);

            Object.keys(fileNameGroupings).forEach(gouping => {
                let matchedPlugins = aggregrationModules.filter(module => );
            });

            let views = files.filter(x => x.indexOf(".bindings.js") > -1).map(x => x.substring(0, x.indexOf(".") + 1));
            files = files.filter(file => views.filter(view => file.startsWith(view)).length === 0);
            views.forEach(x => files.push(x + "view"));
            var that = this;
            resolve(files.map(file => ({
                path: path.resolve(that.directory, file),
                fileName: path.basename(file),
                fileNameWithExtension: file,
                fileExtention: path.extname(file)
            })));
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