const pathUtil = require('../../serverLogic/pathUtil.js');
const fs = require('fs');
const path = require('path');

/**
 * Class should be returned by a file creation preProcess module.
 * 
 * Domain: Server
 * Author: Philip Schoeman
 * */
class preProcessResult {
    /**
     * Constructor. Values should be assigned via the constructor
     * @param {string} fileName The file name of the file, excluding extension. 
     * @param {string} fileExtention The file extension, including the dot.
     * @param {string} filePath The relative file path, relative to the wwwRoot folder
     * @param {string} fileContent The text content of the file.
     * @param {object} replacementTags An object containing tags that will be replaced in the content. The property value is the search value, the property value the replace value.
     */
    constructor(fileName, fileExtention, filePath, fileContent, replacementTags) {
        this.fileName = fileName;
        this.fileExtention = fileExtention;
        this.filePath = filePath;
        this.fileContent = this.replaceTags(replacementTags, fileContent);
    }
    /**
     * Saves the preProcess result to a file and creates the folder if it does not exists.
     * */
    save() {
        var filePath = path.resolve(pathUtil.getWWWRootDir(), this.filePath);
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }
        var fileFullPath = path.resolve(filePath, this.fileName + this.fileExtention);
        fs.writeFileSync(fileFullPath, this.fileContent);
    }
    /**
     * @private
     */
    replaceTags(replacementTags, fileContent) {
        for (var key in replacementTags) {
            fileContent = pathUtil.replaceAll(fileContent, key, replacementTags[key]);
        }
        return fileContent;
    }
}

module.exports = preProcessResult;