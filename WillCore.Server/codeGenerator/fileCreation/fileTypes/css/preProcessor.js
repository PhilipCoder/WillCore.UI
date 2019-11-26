const preProcessResult = require("../../logic/preProcessResult.js");
/**
 * Preprocessor for files.
 * Author : Philip Schoeman
 * */
class preProcessor {
    static processFile(userFileName, fileExtention, filePath, templateName, templateContent) {
        templateName = templateName.replace("fileName", `${userFileName}`);
        return new preProcessResult(templateName, fileExtention, filePath, templateContent, {});
    }
    static validateName(name) {
        var specialCharCheckDot = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        return specialCharCheckDot.test(name) ? 'The name of a CSS file should not contain any special characters.' : true;
    }
};

module.exports = preProcessor;