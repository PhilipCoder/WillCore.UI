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
        templateName = templateName.replace("fileName", `${userFileName}`);
        return new preProcessResult(templateName, fileExtention, filePath, templateContent, { "$safeitemname$": userFileName});
    }

    static validateName(name) {
        var specialCharCheckDot = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        return specialCharCheckDot.test(name) ? 'The name of a view should not contain any special characters.' : true;
    }
};

module.exports = preProcessor;