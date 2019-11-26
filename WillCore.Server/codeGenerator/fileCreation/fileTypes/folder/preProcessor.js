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
        userFileName = userFileName+"/"
        return new preProcessResult(templateName, fileExtention, filePath, templateContent, {});
    }

    static validateName(name) {
        var specialCharCheckDot = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        return specialCharCheckDot.test(name) ? 'The name of a folder should not contain any special characters.' : true;
    }
};

module.exports = preProcessor;