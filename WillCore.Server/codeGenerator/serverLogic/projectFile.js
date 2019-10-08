const path = require('path');
const fs = require("fs");
const fileCreator = require("./fileCreator.js");

class projectFile {
    constructor() {
        this.fileName = path.resolve(__dirname, `../config/project.json`);
        this.configObj = null;
        if (fs.existsSync(this.fileName)) {
            var fileContent = fs.readFileSync(this.fileName, 'utf8');
            this.configObj = JSON.parse(fileContent);
        }
    }

    exists() {
        return !!this.configObj;
    }

    init(useBootstrap, useIndexFile, useGlobalCss) {
        this.configObj = {
            useBootstrap: useBootstrap,
            useIndexFile: useIndexFile,
            useGlobalCss: useGlobalCss
        };
        this.save();
        if (useBootstrap) {
            fileCreator.setBootstrap();
        }
        if (useIndexFile) {
            fileCreator.setIndex(useBootstrap);
        }
        if (useGlobalCss) {
            fileCreator.setDefaultCSS();
        }
    }

    save() {
        var json = JSON.stringify(this.configObj);
        fs.writeFileSync(this.fileName, json);
    }
}

module.exports = new projectFile();