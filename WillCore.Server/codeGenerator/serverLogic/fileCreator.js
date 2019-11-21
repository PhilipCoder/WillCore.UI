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
        url = path.resolve(this.wwwRoot, "../", url);
        if (!fs.existsSync(url)) {
            fs.writeFileSync(url, "");
            return true;
        }
        return false;
    }

    readFile(url) {
        url = path.resolve(this.wwwRoot, "../", url);
        if (fs.existsSync(url)) {
            return fs.readFileSync(url, 'utf8');
        }
    }

    saveFile(url, content) {
        url = path.resolve(this.wwwRoot, "../", url);
        if (fs.existsSync(url)) {
            fs.writeFileSync(url, content);
        }
    }

    async renameFile(filePath, newName) {
        return new Promise(async (resolve, reject) => {
            var viewName = pathUtil.getViewName(filePath);
            var viewFiles = await pathUtil.getViewFiles(filePath);
            viewFiles.forEach(filePath => {
                var newFileName = pathUtil.renameViewFile(filePath, newName);
                fs.renameSync(filePath, newFileName);
                let fileContent = fs.readFileSync(newFileName, 'utf8');
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