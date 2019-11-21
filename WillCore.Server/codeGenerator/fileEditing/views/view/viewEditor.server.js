const fileCreator = require("../../../serverLogic/fileCreator.js");

module.exports = (view) => {
    view.readFile = async (view) => {
        var fileContents = fileCreator.readFile(view.url);
        return fileContents;
    };
    view.saveFile = async (view) => {
        fileCreator.saveFile(view.url, view.contents);
        return true;
    };
};