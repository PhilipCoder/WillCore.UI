var languages = {
    ".js": "ace/mode/javascript",
    ".html": "ace/mode/html",
    ".css": "ace/mode/css",
    ".json": "ace/mode/json"
};

var view = async (view) => {
    var editor = ace.edit(view.$editor.id);
    editor.setTheme("ace/theme/twilight");
    var isViewMode = view.route.route.indexOf(".view") > -1;
    var currentFile = isViewMode ? view.route.route.replace(".view", ".bindings.js") : view.route.route;
    var extension = currentFile.substring(currentFile.lastIndexOf("."));
    var mode = languages[extension] ? languages[extension] : "ace/mode/javascript";
    editor.session.setMode(mode);
    var result = await willCoreModules.server.runRequest("editor/readFile", { url: currentFile });
    editor.session.setValue(result);

    view.$viewModulesLabel.show = () => isViewMode;
    view.$viewModuleLinks.show = () => isViewMode;


    view.$saveFileBtn.event.onclick = async () => {
        await willCoreModules.server.runRequest("editor/saveFile", { url: currentFile, contents: editor.getValue() })
    };
};

export { view };