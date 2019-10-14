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
    var currentFile = isViewMode ? view.route.route.replace(".view", view.route.page ? view.route.page:".bindings.js") : view.route.route;
    var extension = currentFile.substring(currentFile.lastIndexOf("."));
    var mode = languages[extension] ? languages[extension] : "ace/mode/javascript";
    editor.session.setMode(mode);
    var result = await willCoreModules.server.runRequest("editor/readFile", { url: currentFile });
    editor.session.setValue(result);

    view.$viewModulesLabel.show = () => isViewMode;
    view.$viewModuleLinks.show = () => isViewMode;
    view.$htmlModuleLink.attribute.href = () => willCore.url("folderExplorer", { route: view.route.route, page:".html"});
    view.$collectionsModuleLink.attribute.href = () => willCore.url("folderExplorer", { route: view.route.route, page: ".collections.js" });
    view.$eventsModuleLink.attribute.href = () => willCore.url("folderExplorer", { route: view.route.route, page: ".events.js" });
    view.$targetsModuleLink.attribute.href = () => willCore.url("folderExplorer", { route: view.route.route, page: ".targets.js" });
    view.$sourcesModuleLink.attribute.href = () => willCore.url("folderExplorer", { route: view.route.route, page: ".sources.js" });
    view.$logicModuleLink.attribute.href = () => willCore.url("folderExplorer", { route: view.route.route, page: ".logic.js" });
    view.$serverModuleLink.attribute.href = () => willCore.url("folderExplorer", { route: view.route.route, page: ".server.js" });



    view.$saveFileBtn.event.onclick = async () => {
        await willCoreModules.server.runRequest("editor/saveFile", { url: currentFile, contents: editor.getValue() })
    };
};

export { view };