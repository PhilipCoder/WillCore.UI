var languages = {
    ".js": "ace/mode/javascript",
    ".html": "ace/mode/html",
    ".css": "ace/mode/css",
    ".json": "ace/mode/json"
};

var view = async (view) => {
    var editor = ace.edit(view.$editor.id);
    editor.setTheme("ace/theme/twilight");
    var extension = view.route.route.substring(view.route.route.lastIndexOf("."));
    var mode = languages[extension] ? languages[extension] : "ace/mode/javascript";
    editor.session.setMode(mode);
    var result = await willCoreModules.server.runRequest("editor/readFile", { url: view.route.route });
    editor.session.setValue(result);

    view.$saveFileBtn.event.onclick = async () => {
        await willCoreModules.server.runRequest("editor/saveFile", { url: view.route.route, contents: editor.getValue()  })
    };
};

export { view };