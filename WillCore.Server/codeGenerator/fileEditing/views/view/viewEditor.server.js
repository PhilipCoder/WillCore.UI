const fileCreator = require("../../../serverLogic/fileCreator.js");
let fileCreateModuleLoader = require("../../../fileCreation/logic/fileCreateModuleLoader.js");

module.exports = (view) => {
    view.readFile = async (view) => {
        var fileContents = await fileCreator.readFile(view.url);
        return fileContents;
    };
    view.saveFile = async (view) => {
        await fileCreator.saveFile(view.url, view.contents);
        return true;
    };
    view.getSideBar = async (view) => {
        let module = fileCreateModuleLoader.extentionMapping[view.extention];
        module = module.config.editorComponents.filter(x => x.parentElementId === "viewOptions")[0];
        return module.name;
    };
};