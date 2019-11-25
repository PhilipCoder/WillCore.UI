const http = require('https');
const fs = require('fs');
const path = require('path');
const pathUtil = require('./pathUtil.js');

class fileCreator {
    constructor() {
        this.wwwRoot = path.resolve(__dirname, `../../wwwRoot`);
        this.templateDirectory = path.resolve(__dirname, `templates\\`);
        this.indexCodeTag = "<CodeTag>";
    }

    createFolder(url) {
        url = path.resolve(this.wwwRoot, "../", url);
        if (!fs.existsSync(url)) {
            fs.mkdirSync(url);
            return true;
        }
        return false;
    }

    createFile(url) {
        return new Promise(async (resolve, reject) => {
            url = path.resolve(this.wwwRoot, "../", url);
            if ((await fileHelper.exists(url)) === false) {
                await fileHelper.writeFile(url, "");
                resolve(true);
            }
            resolve(false);
        });
    }

    readFile(url) {
        return new Promise(async (resolve, reject) => {
            url = path.resolve(this.wwwRoot, "../", url);
            if ((await fileHelper.exists(url))) {
                return await fileHelper.readFile(url);
            }
        });
    }

    saveFile(url, content) {
        return new Promise(async (resolve, reject) => {
            url = path.resolve(this.wwwRoot, "../", url);
            if ((await fileHelper.exists(url))) {
                await fileHelper.writeFile(url, content)
            }
        });
    }

    async renameFile(filePath, newName) {
        return new Promise(async (resolve, reject) => {
            var viewName = pathUtil.getViewName(filePath);
            var viewFiles = await pathUtil.getViewFiles(filePath);
            viewFiles.forEach(async filePath => {
                var newFileName = pathUtil.renameViewFile(filePath, newName);
                fs.renameSync(filePath, newFileName);
                let fileContent = await fileHelper.readFile(newFileName);
                fileContent = pathUtil.replaceAll(fileContent, `"./${viewName}`, `"./${newName}`);
                fs.writeFileSync(newFileName, fileContent);
            });
            resolve({ success: true });
        });
    }

    async deleteFile(filePath) {
        return new Promise(async (resolve, reject) => {
            var viewFiles = await pathUtil.getViewFiles(filePath);
            viewFiles.forEach(filePath => {
                fs.unlinkSync(filePath);
            });
            resolve({ success: true });
        });
    }
}

module.exports = new fileCreator();