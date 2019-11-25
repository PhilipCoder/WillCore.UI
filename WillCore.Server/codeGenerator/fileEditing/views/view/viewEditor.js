import PNotify from "../../../libraries/pNotify/es/PNotify.js";
PNotify.defaults.styling = 'bootstrap4';

function getViewName(currentFile) {
    var viewName = currentFile.substring(0, currentFile.indexOf("."));
    return viewName.substring(viewName.lastIndexOf("/") + 1);
}

function setupModuleNav(view) {
    view.$editorModuleNav.currentLink = "Bindings";
    view.$editorModuleNav.file = view.route.route;
    view.$editorModuleNav.label = "View Modules";
    view.$editorModuleNav.changeEvent = (file) => {
        view.$editor.file = file;
    };
}

async function runFile() {
    if (view.viewData.linked) {
        await view.$editor.saveFile();
        window.open(window.location.origin + "/#" + view.viewData.route + "?forceUrl=true", '_blank').focus();
    } else {
        PNotify.info({
            text: "Unable to run file. Only linked views can be run.",
            type: 'notice'
        });
    }
}

var view = async (view) => {
    setupModuleNav(view);
    view.$runFileBtn.event.onclick = () => runFile();

    var currentFile = view.route.route.replace(".view", view.route.page ? view.route.page : ".bindings.js");
    view.$editor.linkedEvent = (isLinked) => { };
    view.$editor.file = currentFile;
    view.$editorLinkPanel.setfile(currentFile);
    //view.viewData = await view.server.viewEditor.getViewData({ viewName: getViewName(currentFile) });

    //view.$runIcon.attribute.style = () => ({ color: view.viewData.linked ? "#007900" : "#ff0023"});

    view.$saveFileBtn.event.onclick = async () => {
        await view.$editor.saveFile();
        PNotify.success({
            text: "File Saved.",
            type: 'notice'
        });
    };
};

export { view };


