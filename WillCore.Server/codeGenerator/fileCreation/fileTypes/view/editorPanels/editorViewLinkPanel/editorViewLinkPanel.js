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
    if (view.viewData.viewType === "layout") {
        var linkResult = await view.server.editorViewLinkPanel.linkLayout({
            layoutName: getViewName(currentFile),
            viewPath: getViewDirectory(currentFile),
            layoutElement: view.viewData.layoutElement
        });
    } else {
        var linkResult = await view.server.editorViewLinkPanel.linkView({
            viewName: getViewName(currentFile),
            viewLayout: view.viewData.layout || "Default",
            viewPath: getViewDirectory(currentFile),
            layoutElement: view.viewData.layoutElement,
            viewRoute: view.viewData.route
        });
    }
    view.viewData.linked = true;
    view.viewData = await view.server.editorViewLinkPanel.getViewData({ viewName: getViewName(currentFile) });
    PNotify.success({
        text: "View Linked.",
        type: 'notice'
    });
}

async function unlinkView(view) {
    await view.server.codeGenEditor.unlinkView({
        viewName: getViewName(currentFile)
    });
    view.viewData.linked = false;
    view.viewData = await view.server.editorViewLinkPanel.getViewData({ viewName: getViewName(currentFile) });
    PNotify.success({
        text: "View Unlinked.",
        type: 'notice'
    });
}

class editorViewLinkPanel extends HTMLElement {
    constructor() {
        super();
        this.view = null;
        //this.shadowMode = true;
        willCore["editor-view-link-panel"].load(this);
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

    async setupView() {
        this.viewLoaded = true;
        this.view.layouts = await this.view.server.editorViewLinkPanel.getLayoutViews({});
        this.view.viewData = await this.view.server.editorViewLinkPanel.getViewData({ viewName: getViewName(this.view.values.file) });

        this.view.$linkViewBtn.event.onclick = () => linkView(view);
        this.view.$unLinkViewBtn.event.onclick = () => unlinkView(view);

        this.view.$viewTypeSelect.model = () => this.view.viewData.viewType;
        this.view.$viewLayoutForm.show = () => this.view.viewData.viewType === "view" && !this.view.viewData.layoutPath;
        this.view.$viewRouteForm.show = () => this.view.viewData.viewType === "view";
        this.view.$layoutElementForm.show = () => (this.view.viewData.viewType === "layout" || this.view.viewData.layout === "Default" || !this.view.viewData.layout);
        this.view.$linkViewBtn.disabled = () => this.view.viewData.linked;
        this.view.$layoutElement.model = () => this.view.viewData.layoutElement;
        this.view.$viewRoute.model = () => this.view.viewData.route;
        this.view.$layoutSelect.options = () => this.view.layouts.map(x => [x, x]);
        this.view.$layoutSelect.model = () => this.view.viewData.layout;
        this.view.$linkViewBtn.disabled = () => this.view.viewData.linked;
        this.view.$layoutElementForm.hide = () => this.view.viewData.linked;
        this.view.$viewLayoutLink.show = () => this.view.viewData.linked;
        this.view.$viewRoute.disabled = () => this.view.viewData.linked;
        this.view.$layoutSelect.disabled = () => this.view.viewData.linked;
        this.view.$viewTypeSelect.disabled = () => this.view.viewData.linked;
        this.view.$unLinkViewBtn.show = () => this.view.viewData.linked;
        this.view.$layoutLinkName.innerHTML = () => this.view.viewData.layout;
        if (this.view.viewData.layoutPath) this.view.$viewLayoutLinkAnchor.attribute.href = () => willCore.url("/editor", { route: this.view.viewData.layoutPath });
        this.view.$viewLayoutLink.show = () => !!this.view.viewData.layoutPath;
        this.view.$dependantViews.show = () => !!this.view.viewData.childViews;
        if (!!this.view.viewData.childViews) {
            this.view.$dependantLink.repeat = () => this.view.viewData.childViews;
            this.view.$dependantLink.repeat((elements, row) => {
                elements.$dependantLinkAnchor.innerHTML = () => row.viewName;
                elements.$dependantLinkAnchor.attribute.href = () => willCore.url("/editor", { route: row.viewPath });
            });
        }
    }
}

export { editorViewLinkPanel };