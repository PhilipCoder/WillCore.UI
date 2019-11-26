const preProcessResult = require("../../logic/preProcessResult.js");
const pathUtil = require("../../../serverLogic/pathUtil.js");
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
        let noDashName = pathUtil.replaceAll(userFileName,"-","");
        return new preProcessResult(templateName, fileExtention, filePath, templateContent, { "$safeitemname$": userFileName, "$safeitemnameNoDash$": noDashName});
    }

    static validateName(name) {
        var specialCharCheckDot = /[ !@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/;
        return specialCharCheckDot.test(name) || name.indexOf("-") === -1 ? 'The name of a component should contain at least one "-" and no other special characters.' : true;
    }
};

module.exports = preProcessor;