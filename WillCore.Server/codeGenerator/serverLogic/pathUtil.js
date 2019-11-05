const path = require('path');
const fs = require('fs');

class pathUtil {
    static getWWWRootDir() {
        return path.resolve(__dirname, `../../wwwRoot`);
    }
    static getFileName(filePath) {
        return path.basename(filePath);
    }
    static getViewName(filePath) {
        var fileName = this.getFileName(filePath);
        return fileName.substring(0, fileName.indexOf("."));
    }
    static getFileExtention(filePath) {
        return path.extname(filePath);
    }
    static getFilesInDirectory(directory) {
        return new Promise((resolve, reject) => {
            fs.readdir(directory, function (err, files) {
                if (err) {
                    reject();
                }
                resolve(files);
            });
        });
    }
    static async getViewFiles(viewPath) {
        return new Promise(async (resolve, reject) => {
            var viewDir = path.dirname(viewPath);
            var viewName = this.getFileName(viewPath);
            viewName = this.getViewName(viewName);
            var directoryFiles = await this.getFilesInDirectory(viewDir);
            var viewFiles = directoryFiles.filter(x => this.getViewName(x) === viewName);
            var result = viewFiles.map(x => path.resolve(viewDir, x));
            resolve(result);
        });
    }

    static renameViewFile(fileName, newViewName) {
        var viewName = this.getViewName(fileName);
        return fileName.replace(`${viewName}.`, `${newViewName}.`);
    }

    /**
     * Method to replace all occurrences in a string.
     * @param {string} target
     * @param {string} search
     * @param {string} replacement
     */
    static replaceAll(target, search, replacement) {
        search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return target.replace(new RegExp(search, 'g'), replacement);
    }
}

module.exports = pathUtil;