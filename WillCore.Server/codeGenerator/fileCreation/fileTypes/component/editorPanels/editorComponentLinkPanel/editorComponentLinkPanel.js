import PNotify from "../../../../../libraries/pNotify/es/PNotify.js";


function getViewName(currentFile) {
    var viewName = currentFile.substring(0, currentFile.indexOf("."));
    return viewName.substring(viewName.lastIndexOf("/") + 1);
}

function getViewDirectory(currentFile) {
    var viewName = currentFile.substring(currentFile.indexOf("/"));
    return viewName.substring(0, viewName.lastIndexOf("/"));
}

async function linkView(view) {
    let linkingError = null;
    if (view.viewData.viewType === "layout") {
        var linkResult = await view.server.editorViewLinkPanel.linkLayout({
            layoutName: getViewName(view.values.file),
            viewPath: view.values.file
        });
    } else {
        if (validRouteName(view)) {
            var linkResult = await view.server.editorViewLinkPanel.linkView({
                viewName: getViewName(view.values.file),
                viewLayout: view.viewData.layout || "Default",
                viewPath: view.values.file,
                layoutElement: view.viewData.layoutElement,
                viewRoute: view.viewData.route
            });
            linkingError = linkResult === false ? linkResult : linkingError;
        } else {
            linkingError = "Enter valid route. A route should start with a / and should not contain any special characters. Example: /home.";
        }
    }
    if (linkingError) {
        PNotify.error({
            text: linkingError,
            type: 'notice'
        });
    } else {
        view.viewData.linked = true;
        view.viewData = await view.server.editorViewLinkPanel.getViewData({ viewName: getViewName(view.values.file) });
        PNotify.success({
            text: "View Linked.",
            type: 'notice'
        });
    }
}

async function unlinkView(view) {
    let unlinkResult = await view.server.editorViewLinkPanel.unlinkView({
        viewName: getViewName(view.values.file)
    });
    if (unlinkResult === true) {
        view.viewData.linked = false;
        view.viewData = await view.server.editorViewLinkPanel.getViewData({ viewName: getViewName(view.values.file) });
        PNotify.success({
            text: "View Unlinked.",
            type: 'notice'
        });
    } else {
        PNotify.error({
            text: unlinkResult,
            type: 'notice'
        });
    }
}

class editorComponentLinkPanel extends HTMLElement {
    constructor() {
        super();
        this.view = null;
        //this.shadowMode = true;
        this._linkedEvent = null;
    }
    main(view) {
        view.values = { file: null };
    }

    setfile(value) {
        this.view.values.file = value;
        this.setupView();
    }

    set changeEvent(value) {
        this._changeEvent = value;
    }

    set currentLink(value) {
        this.view.values.currentLink = value;
    }

    set linkedEvent(value) {
        this._linkedEvent = value;
    }

    connectedCallback() {
        willCore["editor-component-link-panel"].load(this);
    }

    async setupView() {
        this.viewLoaded = true;
        this.view.viewData = await this.view.server.editorViewLinkPanel.getViewData({ viewName: getViewName(this.view.values.file) });
        this.view.$unLinkComponentBtn.event.onclick = () => unlinkView(this.view);
        this.view.$unLinkComponentBtn.show = () => this.view.viewData.linked;

        this.view.$linkComponentBtn.show = () => !this.view.viewData.linked;
        this.view.$linkComponentBtn.event.onclick = () => linkView(this.view);
        
    }
}

export { editorComponentLinkPanel };