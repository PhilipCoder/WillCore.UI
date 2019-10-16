import PNotify from "../../libraries/pNotify/es/PNotify.js";
PNotify.defaults.styling = 'bootstrap4';
//import { PNotifyButtons } from '../../libraries/pNotify/es/PNotifyButtons.js';

var languages = {
    ".js": "ace/mode/javascript",
    ".html": "ace/mode/html",
    ".css": "ace/mode/css",
    ".json": "ace/mode/json"
};

async function loadFileIntoEditor(currentFile, editor) {
    var extension = currentFile.substring(currentFile.lastIndexOf("."));
    var mode = languages[extension] ? languages[extension] : "ace/mode/javascript";
    editor.session.setMode(mode);
    var result = await willCoreModules.server.runRequest("editor/readFile", { url: currentFile });
    editor.session.setValue(result);
};

var view = async (view) => {
    var editor = ace.edit(view.$editor.id);
    editor.setTheme("ace/theme/twilight");
    var isViewMode = view.route.route.indexOf(".view") > -1;
    var baseURL = view.route.route;
    var currentFile = isViewMode ? baseURL.replace(".view", view.route.page ? view.route.page : ".bindings.js") : baseURL;
    await loadFileIntoEditor(currentFile, editor);

    view.currentModule = { name: "bindings" };

    view.$viewModulesLabel.show = () => isViewMode;
    view.$viewModuleLinks.show = () => isViewMode;
    view.$htmlModuleLink.event.onclick = async () => {
        view.currentModule.name = "html";
        currentFile = baseURL.replace(".view", ".html");
        await loadFileIntoEditor(currentFile, editor);
    };
    view.$bindingsModuleLink.event.onclick = async () => {
        view.currentModule.name = "bindings";
        currentFile = baseURL.replace(".view", ".bindings.js");
        await loadFileIntoEditor(currentFile, editor);
    };
    view.$collectionsModuleLink.event.onclick = async () => {
        view.currentModule.name = "collections";
        currentFile = baseURL.replace(".view", ".collections.js");
        await loadFileIntoEditor(currentFile, editor);
    };
    view.$eventsModuleLink.event.onclick = async () => {
        view.currentModule.name = "events";
        currentFile = baseURL.replace(".view", ".events.js");
        await loadFileIntoEditor(currentFile, editor);
    };
    view.$targetsModuleLink.event.onclick = async () => {
        view.currentModule.name = "targets";
        currentFile = baseURL.replace(".view", ".targets.js");
        await loadFileIntoEditor(currentFile, editor);
    };
    view.$sourcesModuleLink.event.onclick = async () => {
        view.currentModule.name = "sources";
        currentFile = baseURL.replace(".view", ".sources.js");
        await loadFileIntoEditor(currentFile, editor);
    };
    view.$logicModuleLink.event.onclick = async () => {
        view.currentModule.name = "logic";
        currentFile = baseURL.replace(".view", ".logic.js");
        await loadFileIntoEditor(currentFile, editor);
    };
    view.$serverModuleLink.event.onclick = async () => {
        view.currentModule.name = "server";
        currentFile = baseURL.replace(".view", ".server.js");
        await loadFileIntoEditor(currentFile, editor);
    };

    view.$htmlModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "html"});
    view.$bindingsModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "bindings" });
    view.$collectionsModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "collections" });
    view.$eventsModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "events" });
    view.$targetsModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "targets" });
    view.$sourcesModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "sources" });
    view.$logicModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "logic" });
    view.$serverModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "server" });



    view.$saveFileBtn.event.onclick = async () => {
        await willCoreModules.server.runRequest("editor/saveFile", { url: currentFile, contents: editor.getValue() })
        PNotify.success({
            text: "File Saved.",
            type: 'notice'
        });
    };
};

export { view };

