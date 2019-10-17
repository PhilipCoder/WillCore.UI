import PNotify from "../../libraries/pNotify/es/PNotify.js";
import { loadFileIntoEditor } from "./editor.manaco.js";
PNotify.defaults.styling = 'bootstrap4';
//import { PNotifyButtons } from '../../libraries/pNotify/es/PNotifyButtons.js';



function getViewDirectory(currentFile) {
    var viewName = currentFile.substring(currentFile.indexOf("/"));
    return viewName.substring(0,viewName.lastIndexOf("/") );
}

function getViewName(currentFile) {
    var viewName = currentFile.substring(0, currentFile.indexOf("."));
    return viewName.substring(viewName.lastIndexOf("/") + 1);
}

var view = async (view) => {
    var isViewMode = view.route.route.indexOf(".view") > -1;
    var baseURL = view.route.route;
    var currentFile = isViewMode ? baseURL.replace(".view", view.route.page ? view.route.page : ".bindings.js") : baseURL;
    await loadFileIntoEditor(currentFile, view);
    view.currentModule = { name: "bindings" };
    view.viewData = await willCoreModules.server.runRequest("editor/getViewData", { viewName: getViewName(currentFile) });

    view.$viewModulesLabel.show = () => isViewMode;
    view.$viewModuleLinks.show = () => isViewMode;
    view.$htmlModuleLink.event.onclick = async () => {
        view.currentModule.name = "html";
        currentFile = baseURL.replace(".view", ".html");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$bindingsModuleLink.event.onclick = async () => {
        view.currentModule.name = "bindings";
        currentFile = baseURL.replace(".view", ".bindings.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$collectionsModuleLink.event.onclick = async () => {
        view.currentModule.name = "collections";
        currentFile = baseURL.replace(".view", ".collections.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$eventsModuleLink.event.onclick = async () => {
        view.currentModule.name = "events";
        currentFile = baseURL.replace(".view", ".events.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$targetsModuleLink.event.onclick = async () => {
        view.currentModule.name = "targets";
        currentFile = baseURL.replace(".view", ".targets.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$sourcesModuleLink.event.onclick = async () => {
        view.currentModule.name = "sources";
        currentFile = baseURL.replace(".view", ".sources.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$logicModuleLink.event.onclick = async () => {
        view.currentModule.name = "logic";
        currentFile = baseURL.replace(".view", ".logic.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$serverModuleLink.event.onclick = async () => {
        view.currentModule.name = "server";
        currentFile = baseURL.replace(".view", ".server.js");
        await loadFileIntoEditor(currentFile, view);
    };
    view.$linkViewBtn.event.onclick = async () => {
        if (view.viewData.viewType === "layout") {
            var linkResult = await willCoreModules.server.runRequest("editor/linkLayout", {
                layoutName: getViewName(currentFile),
                viewPath: getViewDirectory(currentFile),
                layoutElement: view.viewData.layoutElement
            });
        } else {
            var linkResult = await willCoreModules.server.runRequest("editor/linkView", {
                layoutName: getViewName(currentFile),
                viewPath: getViewDirectory(currentFile),
                layoutElement: view.viewData.layoutElement,
                viewRoute: view.viewData.route
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
    view.$viewLayoutForm.show = () => view.viewData.viewType === "view";
    view.$viewRouteForm.show = () => view.viewData.viewType === "view";
    view.$layoutElementForm.show = () => view.viewData.viewType === "layout";
    view.$linkViewBtn.disabled = () => view.viewData.linked;
    view.$layoutElement.model = () => view.viewData.layoutElement;
    view.$viewRoute.model = () => view.viewData.route;
    view.$saveFileBtn.event.onclick = async () => {
        await willCoreModules.server.runRequest("editor/saveFile", { url: currentFile, contents: editor.getValue() })
        PNotify.success({
            text: "File Saved.",
            type: 'notice'
        });
    };
};

export { view };


