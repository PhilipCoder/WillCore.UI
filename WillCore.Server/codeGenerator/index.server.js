const fileEditingModuleLoader = require("./fileEditing/logic/fileEditingModuleLoader.js");
const fileCreateModuleLoader = require("./fileCreation/logic/fileCreateModuleLoader.js");
const indexParser = require("./serverLogic/parser/indexLinker.js");

const path = require("path");
module.exports = (view) => {
    var aa = new indexParser(path.resolve(__dirname, "index.js"));
    var bb = aa.removeComponent("monaco-editor");
    view.getFileEditingViews = async (view) => {
        await fileEditingModuleLoader.loadPromise;
        let editorComponents = await fileCreateModuleLoader.getEditorModules();
        return { fileEditors: fileEditingModuleLoader.modules, editorComponents: editorComponents };
    };
};