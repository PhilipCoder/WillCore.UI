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
};

module.exports = preProcessor;