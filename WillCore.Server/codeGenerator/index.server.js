const fileEditingModuleLoader = require("./fileEditing/logic/fileEditingModuleLoader.js");
const fileCreateModuleLoader = require("./fileCreation/logic/fileCreateModuleLoader.js");


module.exports = (view) => {
    view.getFileEditingViews = async (view) => {
        await fileEditingModuleLoader.loadPromise;
        let editorComponents = await fileCreateModuleLoader.getEditorModules();
        return { fileEditors: fileEditingModuleLoader.modules, editorComponents: editorComponents };
    };
};