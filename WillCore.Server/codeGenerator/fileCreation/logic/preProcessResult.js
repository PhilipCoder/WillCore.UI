const pathUtil = require('../../serverLogic/pathUtil.js');
const fs = require('fs');

/**
 * Class should be returned by a file creation preProcess module.
 * Author: Philip Schoeman
 * */
class preProcessResult {
    /**
     * Constructor. Values should be assigned via the constructor
     * @param {string} fileName 
     * @param {string} fileContent
     * @param {object} replacementTags
     */
    constructor(fileName, fileContent, replacementTags) {
        this.fileName = fileName;
        this.fileContent = this.replaceTags(replacementTags,fileContent);
    }

    /**
     * Saves the preProcess result to a file
     * */
    save() {
        url = path.resolve(this.wwwRoot, "../", url);
        if (fs.existsSync(url)) {
            fs.writeFileSync(url, content);
        }
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