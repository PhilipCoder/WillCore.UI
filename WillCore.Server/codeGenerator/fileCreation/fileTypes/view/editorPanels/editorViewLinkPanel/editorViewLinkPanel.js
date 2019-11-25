import PNotify from "../../../../../libraries/pNotify/es/PNotify.js";

function getHTMLElements(viewName, view) {
    return new Promise(async (resolve, reject) => {
        let layoutHTML = await view.server.editorViewLinkPanel.getLayoutHTML({ layoutName: viewName });
        let tmpDiv = document.createElement("div");
        tmpDiv.innerHTML = layoutHTML;
        resolve(Array.from(tmpDiv.querySelectorAll("[id]")).map(x => "$" + x.id));
    });
}

function getViewName(currentFile) {
    var viewName = currentFile.substring(0, currentFile.indexOf("."));
    return viewName.substring(viewName.lastIndexOf("/") + 1);
}

function getViewDirectory(currentFile) {
    var viewName = currentFile.substring(currentFile.indexOf("/"));
    return viewName.substring(0, viewName.lastIndexOf("/"));
}

function validRouteName(view) {
    var specialCharCheckDot = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (view.viewData.route.startsWith("/") && specialCharCheckDot.test(view.viewData.route.substring(1)) === false) {
        return true;
    }
 
    return false;
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

class editorViewLinkPanel extends HTMLElement {
    constructor() {
        super();
        this.view = null;
        //this.shadowMode = true;
        willCore["editor-view-link-panel"].load(this);
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

    async setupView() {
        this.viewLoaded = true;
        this.view.viewData = await this.view.server.editorViewLinkPanel.getViewData({ viewName: getViewName(this.view.values.file) });
        this.view.layouts = await this.view.server.editorViewLinkPanel.getLayoutViews({});
        if (this.view.viewData.viewType === "view") {
            this.view.layoutElements = await getHTMLElements(this.view.viewData.layout, this.view);
        }
        this.view.$unLinkViewBtn.event.onclick = () => unlinkView(this.view);
        this.view.$unLinkViewBtn.show = () => this.view.viewData.linked;

        this.view.$viewTypeSelect.model = () => this.view.viewData.viewType;
        this.view.$viewTypeSelect.disabled = () => this.view.viewData.linked;

        this.view.$viewLayoutForm.show = () => this.view.viewData.viewType === "view" && !this.view.viewData.layoutPath;
        this.view.$viewRouteForm.show = () => this.view.viewData.viewType === "view";
        this.view.$layoutElementForm.show = () => this.view.viewData.viewType === "view";
        
        this.view.$layoutElement.options = () => this.view.layoutElements.map(x => [x, x]);
        this.view.$layoutElement.model = () => this.view.viewData.layoutElement;
        this.view.$layoutElement.disabled = () => this.view.viewData.linked;

        this.view.$viewRoute.model = () => this.view.viewData.route;
        this.view.$viewRoute.disabled = () => this.view.viewData.linked;

        this.view.$layoutSelect.options = () => this.view.layouts.map(x => [x, x]);
        this.view.$layoutSelect.model = () => this.view.viewData.layout;
        this.view.$layoutSelect.disabled = () => this.view.viewData.linked;

        this.view.$linkViewBtn.show = () => !this.view.viewData.linked && ((this.view.layoutElements && this.view.layoutElements.length > 0) && this.view.viewData.layoutElement || this.view.viewData.viewType === "layout");
        this.view.$linkViewBtn.event.onclick = () => linkView(this.view);

        this.view.$viewLayoutLink.show = () => !!this.view.viewData.layoutPath;

        this.view.$noElementsError.show = () => this.view.viewData.viewType === "view" && this.view.layoutElements && this.view.layoutElements.length === 0;

        this.view.$layoutLinkName.innerHTML = () => this.view.viewData.layout;

        if (this.view.viewData.layoutPath) this.view.$viewLayoutLinkAnchor.attribute.href = () => willCore.url("/viewEditor", { route: this.view.viewData.layoutPath });
        this.view.$dependantViews.show = () => !!this.view.viewData.childViews;
        if (!!this.view.viewData.childViews) {
            this.view.$dependantLink.repeat = () => this.view.viewData.childViews;
            this.view.$dependantLink.repeat((elements, row) => {
                elements.$dependantLinkAnchor.innerHTML = () => row.viewName;
                elements.$dependantLinkAnchor.attribute.href = () => willCore.url("/viewEditor", { route: row.viewPath });
            });
        }
        this.view.viewData = async (target, property, value) => {
            if (property === "layout") {
                this.view.layoutElements = await getHTMLElements(this.view.viewData.layout, this.view);
                this.view.viewData.layoutElement = "";
            }
            if (property === "linked" && this._linkedEvent) {
                this._linkedEvent(value);
            }
        };
    }
}

export { editorViewLinkPanel };