const fileEditingModuleLoader = require("./fileEditing/logic/fileEditingModuleLoader.js");


module.exports = (view) => {
    view.getFileEditingViews = async (view) => {
        await fileEditingModuleLoader.loadPromise;
        return fileEditingModuleLoader.modules;
    };
};