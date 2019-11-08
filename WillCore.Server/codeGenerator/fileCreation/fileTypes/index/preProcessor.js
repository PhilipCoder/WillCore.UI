const preProcessResult = require("../../logic/preProcessResult.js");
/**
 * Preprocessor for view files.
 * Author : Philip Schoeman
 * */
class preProcessor {
    /**
     * Processes a view template file before saving
     * @param {string} userFileName
     * @param {string} templateName
     * @param {string} filePath
     * @param {string} templateContent
     */
    static processFile(userFileName, fileExtention, filePath, templateName, templateContent) {
        return new preProcessResult(templateName, fileExtention, filePath, templateContent, {});
    }
};

module.exports = preProcessor;