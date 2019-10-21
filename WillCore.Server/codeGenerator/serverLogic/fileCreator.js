const http = require('https');
const fs = require('fs');
const path = require('path');
const pathUtil = require('./pathUtil.js');
const projectConfig = require('../config/projectConfig.json');

class fileCreator {
    constructor() {
        this.wwwRoot = path.resolve(__dirname, `../../wwwRoot`);
        this.templateDirectory = path.resolve(__dirname, `templates\\`);
        this.indexCodeTag = "<CodeTag>";
    }

    async setBootstrap() {
        let bootstrapDirectory = path.resolve(this.wwwRoot, "css\\");
        if (!fs.existsSync(bootstrapDirectory)) {
            fs.mkdirSync(bootstrapDirectory);
            bootstrapDirectory = path.resolve(bootstrapDirectory, "bootstrap\\");
            fs.mkdirSync(bootstrapDirectory);
        }
        let bootstrapTemplateDirectory = path.resolve(this.templateDirectory, "bootstrap\\");
        let files = await this.readFilesInDirectory(bootstrapTemplateDirectory);
        files.forEach(file => {
            file = path.resolve(bootstrapTemplateDirectory, file);
            let fileContent = fs.readFileSync(file, 'utf8');
            let outputFileName = path.resolve(bootstrapDirectory, path.basename(file));
            fs.writeFileSync(outputFileName, fileContent);
        });
    }

    async setIndex(useBootstrap) {
        let indexTemplateDirectory = path.resolve(this.templateDirectory, "index\\" + (useBootstrap ? "bootstrap\\" : "default\\"));
        let files = await this.readFilesInDirectory(indexTemplateDirectory);
        files.forEach(file => {
            file = path.resolve(indexTemplateDirectory, file);
            let fileContent = fs.readFileSync(file, 'utf8');
            let outputFileName = path.resolve(this.wwwRoot, path.basename(file));
            fs.writeFileSync(outputFileName, fileContent);
        });
    }

    async setView(viewName) {
        let indexTemplateDirectory = path.resolve(this.templateDirectory, "view\\");
        let files = await this.readFilesInDirectory(indexTemplateDirectory);
        var name = viewName.substring(viewName.lastIndexOf("\\") + 1);
        var filePath = viewName.substring(0, viewName.lastIndexOf("\\"));
        files.forEach(file => {
            var inputFile = path.resolve(indexTemplateDirectory, file);
            let fileContent = fs.readFileSync(inputFile, 'utf8');
            file = file.replace(new RegExp("/", 'g'), "\\");
            file = file.replace(new RegExp("view_itemName", 'g'), name);
            fileContent = fileContent.replace(new RegExp("$safeitemname$", 'g'), name);

            let outputFileName = path.resolve(this.wwwRoot + "/..", filePath, file);
            fs.writeFileSync(outputFileName, fileContent);
        });
    }

    async setDefaultCSS() {
        let defaultCssDirectory = path.resolve(this.wwwRoot, "css\\", "defaultCss\\");
        if (!fs.existsSync(defaultCssDirectory)) {
            fs.mkdirSync(defaultCssDirectory);
        }
        let defaultCssTemplateDirectory = path.resolve(this.templateDirectory, "defaultCss\\");
        let files = await this.readFilesInDirectory(defaultCssTemplateDirectory);
        files.forEach(file => {
            file = path.resolve(defaultCssTemplateDirectory, file);
            let fileContent = fs.readFileSync(file, 'utf8');
            let outputFileName = path.resolve(defaultCssDirectory, path.basename(file));
            fs.writeFileSync(outputFileName, fileContent);
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

    downloadFile(url, dest) {
        return new Promise((resolve, reject) => {
            var file = fs.createWriteStream(dest);
            var request = http.get(url, function (response) {
                response.pipe(file);
                file.on('finish', function () {
                    file.close(resolve);
                    resolve(true);
                });
            }).on('error', function (err) {
                fs.unlink(dest);
                resolve(false);
            });
        });
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

    linkView(viewName, viewPath, viewLayout, viewLayoutElement, viewRoute) {
        var indexFile = path.resolve(this.wwwRoot, "index.js");
        if (fs.existsSync(indexFile)) {
            var fileContents = fs.readFileSync(indexFile, 'utf8');
            var codeTagIndex = fileContents.indexOf(this.indexCodeTag);
            if (codeTagIndex < 0) {
                return false;
            }
            codeTagIndex -= 2;
            var viewLinkingCode = '';
            if (viewLayout === "Default") {
                viewLinkingCode = `willCore.${viewName} = [willCore.$${viewLayoutElement}, willCoreModules.url, "${viewPath}/${viewName}.js", willCoreModules.url, "${viewPath}/${viewName}.html", willCoreModules.route, "${viewRoute}", x => true];\n`;
            } else {
                viewLinkingCode = `willCore.${viewName} = [willCore.$${viewLayout}.${viewLayoutElement}, willCoreModules.url, "${viewPath}/${viewName}.js", willCoreModules.url, "${viewPath}/${viewName}.html", willCoreModules.route, "${viewRoute}", x => true, willCore.${viewLayout}];\n`;
            }
            var output = fileContents.slice(0, codeTagIndex) + viewLinkingCode + fileContents.slice(codeTagIndex);
            fs.writeFileSync(indexFile, output);
        } else {
            return false;
        }
    }

    linkLayout(viewName, viewPath, viewLayoutElement) {
        var indexFile = path.resolve(this.wwwRoot, "index.js");
        if (fs.existsSync(indexFile)) {
            var fileContents = fs.readFileSync(indexFile, 'utf8');
            var codeTagIndex = fileContents.indexOf(this.indexCodeTag);
            if (codeTagIndex < 0) {
                return false;
            }
            codeTagIndex -= 2;
            var viewLinkingCode = `willCore.${viewName} = [willCoreModules.layout,  "${viewPath}/${viewName}.js","${viewPath}/${viewName}.html"];\n`;
            var output = fileContents.slice(0, codeTagIndex) + viewLinkingCode + fileContents.slice(codeTagIndex);
            fs.writeFileSync(indexFile, output);
        } else {
            return false;
        }
    }

    async renameFile(filePath, newName) {
        return new Promise(async (resolve, reject) => {
            var viewName = pathUtil.getViewName(filePath);
            var viewFiles = await pathUtil.getViewFiles(filePath);
            viewFiles.forEach(filePath => {
                var newFileName = pathUtil.renameViewFile(filePath, newName);
                fs.renameSync(filePath, newFileName);
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