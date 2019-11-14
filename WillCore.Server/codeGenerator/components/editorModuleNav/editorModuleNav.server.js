let fileCreateModuleLoader = require("../../fileCreation/logic/fileCreateModuleLoader.js");

module.exports = (view) => {
    view.getViewNavItems = async (view) => {
        let module = fileCreateModuleLoader.extentionMapping[view.extention];
        return module.config.moduleLinks;
    };
};