import PNotify from "../../libraries/pNotify/es/PNotify.js";
import { loadFileIntoEditor } from "./codeGenEditor.manaco.js";
PNotify.defaults.styling = 'bootstrap4';
//import { PNotifyButtons } from '../../libraries/pNotify/es/PNotifyButtons.js';



function getViewDirectory(currentFile) {
    var viewName = currentFile.substring(currentFile.indexOf("/"));
    return viewName.substring(0, viewName.lastIndexOf("/"));
}

function getViewName(currentFile) {
    var viewName = currentFile.substring(0, currentFile.indexOf("."));
    return viewName.substring(viewName.lastIndexOf("/") + 1);
}

var view = async (view) => {
    var isViewMode = view.route.route.indexOf(".view") > -1;
    view.$viewOptions.show = () => isViewMode;
    view.$viewModulesLabel.show = () => isViewMode;
    view.$viewModuleLinks.show = () => isViewMode;

    var baseURL = view.route.route;
    var currentFile = isViewMode ? baseURL.replace(".view", view.route.page ? view.route.page : ".bindings.js") : baseURL;
  //  await loadFileIntoEditor(currentFile, view);
    view.$editor.file = currentFile;
    view.currentModule = { name: "bindings" };
    view.viewData = await willCoreModules.server.runRequest("codeGenEditor/getViewData", { viewName: getViewName(currentFile) });
    view.layouts = await willCoreModules.server.runRequest("codeGenEditor/getLayoutViews", {});


    view.$htmlModuleLink.event.onclick = async () => {
        await view.$editor.saveFile();
        view.currentModule.name = "html";
        currentFile = baseURL.replace(".view", ".html");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$bindingsModuleLink.event.onclick = async () => {
        await view.$editor.saveFile();
        view.currentModule.name = "bindings";
        currentFile = baseURL.replace(".view", ".bindings.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$collectionsModuleLink.event.onclick = async () => {
        await view.$editor.saveFile();
        view.currentModule.name = "collections";
        currentFile = baseURL.replace(".view", ".collections.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$eventsModuleLink.event.onclick = async () => {
        await view.$editor.saveFile();
        view.currentModule.name = "events";
        currentFile = baseURL.replace(".view", ".events.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$targetsModuleLink.event.onclick = async () => {
        await view.$editor.saveFile();
        view.currentModule.name = "targets";
        currentFile = baseURL.replace(".view", ".targets.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$sourcesModuleLink.event.onclick = async () => {
        await view.$editor.saveFile();
        view.currentModule.name = "sources";
        currentFile = baseURL.replace(".view", ".sources.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$logicModuleLink.event.onclick = async () => {
        await view.$editor.saveFile();
        view.currentModule.name = "logic";
        currentFile = baseURL.replace(".view", ".logic.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$serverModuleLink.event.onclick = async () => {
        await view.$editor.saveFile();
        view.currentModule.name = "server";
        currentFile = baseURL.replace(".view", ".server.js");
        await loadFileIntoEditor(currentFile, view);
    };
    
    view.$linkViewBtn.event.onclick = async () => {
        if (view.viewData.viewType === "layout") {
            var linkResult = await willCoreModules.server.runRequest("codeGenEditor/linkLayout", {
                layoutName: getViewName(currentFile),
                viewPath: getViewDirectory(currentFile),
                layoutElement: view.viewData.layoutElement
            });
        } else {
            var linkResult = await willCoreModules.server.runRequest("codeGenEditor/linkView", {
                viewName: getViewName(currentFile),
                viewLayout: view.viewData.layout || "Default",
                viewPath: getViewDirectory(currentFile),
                layoutElement: view.viewData.layoutElement,
                viewRoute: view.viewData.route
            });
        }
        view.viewData.linked = true;
        view.viewData = await willCoreModules.server.runRequest("codeGenEditor/getViewData", { viewName: getViewName(currentFile) });
        PNotify.success({
            text: "View Linked.",
            type: 'notice'
        });
    };
    view.$unLinkViewBtn.event.onclick = async () => {
        await willCoreModules.server.runRequest("codeGenEditor/unlinkView", {
            viewName: getViewName(currentFile)
        });
        view.viewData.linked = false;
        view.viewData = await willCoreModules.server.runRequest("codeGenEditor/getViewData", { viewName: getViewName(currentFile) });
        PNotify.success({
            text: "View Unlinked.",
            type: 'notice'
        });
    };
    view.$runFileBtn.event.onclick = async () => {
        if (view.viewData.linked) {
            await view.$editor.saveFile();
            window.open(window.location.origin + "/#" + view.viewData.route +"?forceUrl=true", '_blank').focus();
        } else {
            PNotify.info({
                text: "Unable to run file. Only linked views can be run.",
                type: 'notice'
            });
        }
    };

    view.$htmlModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "html" });
    view.$bindingsModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "bindings" });
    view.$collectionsModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "collections" });
    view.$eventsModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "events" });
    view.$targetsModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "targets" });
    view.$sourcesModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "sources" });
    view.$logicModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "logic" });
    view.$serverModuleLink.attribute.class = () => ({ activeLink: () => view.currentModule.name === "server" });
    view.$viewTypeSelect.model = () => view.viewData.viewType;
    view.$viewLayoutForm.show = () => view.viewData.viewType === "view" &&  !view.viewData.layoutPath;
    view.$viewRouteForm.show = () => view.viewData.viewType === "view";
    view.$layoutElementForm.show = () => (view.viewData.viewType === "layout" || view.viewData.layout === "Default" || !view.viewData.layout) ;
    view.$linkViewBtn.disabled = () => view.viewData.linked;
    view.$layoutElement.model = () => view.viewData.layoutElement;
    view.$viewRoute.model = () => view.viewData.route;
    view.$layoutSelect.options = () => view.layouts.map(x => [x, x]);
    view.$layoutSelect.model = () => view.viewData.layout;
    view.$linkViewBtn.disabled = () => view.viewData.linked;
    view.$layoutElementForm.hide = () => view.viewData.linked;
    view.$viewLayoutLink.show = () => view.viewData.linked;
    view.$viewRoute.disabled = () => view.viewData.linked;
    view.$layoutSelect.disabled = () => view.viewData.linked;
    view.$viewTypeSelect.disabled = () => view.viewData.linked;
    view.$unLinkViewBtn.show = () => view.viewData.linked;
    view.$layoutLinkName.innerHTML = () => view.viewData.layout;
    if (view.viewData.layoutPath) view.$viewLayoutLinkAnchor.attribute.href = () => willCore.url("/editor", { route: view.viewData.layoutPath});
    view.$viewLayoutLink.show = () => !!view.viewData.layoutPath;
    view.$dependantViews.show = () => !!view.viewData.childViews;
    view.$runIcon.attribute.style = () => ({ color: view.viewData.linked ? "#007900" : "#ff0023"});
    if (!!view.viewData.childViews) {
        view.$dependantLink.repeat = () => view.viewData.childViews;
        view.$dependantLink.repeat((elements, row) => {
            elements.$dependantLinkAnchor.innerHTML = () => row.viewName;
            elements.$dependantLinkAnchor.attribute.href = () => willCore.url("/editor", { route: row.viewPath });
        });
    }

    view.$saveFileBtn.event.onclick = async () => {
        await view.$editor.saveFile();
        PNotify.success({
            text: "File Saved.",
            type: 'notice'
        });
    };
};

export { view };


