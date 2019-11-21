const fileEditingModuleLoader = require("./fileEditing/logic/fileEditingModuleLoader.js");
const fileCreateModuleLoader = require("./fileCreation/logic/fileCreateModuleLoader.js");
const indexLinker = require("./serverLogic/parser/indexLinker.js");
const indexParser = require("./serverLogic/parser/indexParser.js");


const path = require("path");
module.exports = (view) => {
    var parser = new indexParser(path.resolve(__dirname, "index.js"));
    var result = parser.processIndexFile();
    var aa = new indexLinker(path.resolve(__dirname, "index.js"));
    aa.addBinding("ww");
    var bb = aa.removeBinding("monaco-editor");
    view.getFileEditingViews = async (view) => {
        await fileEditingModuleLoader.loadPromise;
        let editorComponents = await fileCreateModuleLoader.getEditorModules();
        return { fileEditors: fileEditingModuleLoader.modules, editorComponents: editorComponents };
    };
};