const projectFile = require("../../../../../serverLogic/projectFile.js");
const indexCore = require("../../../../../serverLogic/indexCore.js");
const projectConstants = require("../../../../../config/projectConstants.js");
const index = new indexCore();

module.exports = (view) => {
    view.getViewData = async (view) => {
        let views = index.linkedAssignables.views.filter(x => x.name == view.viewName);
        let layouts = index.linkedAssignables.layouts.filter(x => x.name == view.viewName);
        let result = { name: undefined, viewType: undefined, layout: undefined, layoutElement: undefined };
        if (views.length > 0) {
            let view = views[0];
            result = { name: view.name, viewType: "view", layout: undefined, layoutElement: undefined };
            if (view.layout) {
                result.layout = view.layout;
                let viewLayout = layouts.filter(x => x.name === view.layout);
                if (viewLayout.length > 0) {
                    viewLayout = viewLayout[0];
                    let layoutPath = viewLayout.htmlUrl.substring(viewLayout.htmlUrl.lastIndexOf(`/${projectConstants.WWWROOT_INDICATOR}`))
                    view.layoutPath = layoutPath;
                }
            }
        } else if (layouts.length > 0) {
            let layout = layouts[0];
        }
        return view;
    };
    view.getLayoutViews = async (view) => {
        //  return projectFile.getLayouts();
    };
    view.linkLayout = (view) => {
        //    projectFile.linkLayout(view.layoutName, view.layoutElement);
        //   fileCreator.linkLayout(view.layoutName, view.viewPath, view.layoutElement);
        return true;
    };
    view.linkView = (view) => {
        //  projectFile.linkView(view.viewName, view.viewRoute, view.viewLayout);
        // var layoutElement = view.viewLayout === "Default" ? view.layoutElement : projectFile.getView(view.viewLayout).layoutElement;
        // fileCreator.linkView(view.viewName, view.viewPath, view.viewLayout, layoutElement, view.viewRoute);
        return true;
    };
    view.unlinkView = (view) => {
        //projectFile.unlinkView(view.viewName);
        return true;
    };
};