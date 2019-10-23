const configuration = {
};

/**
 * WillCore View: 
 * IOC binding that brings all the modules together for the view.
 * 
 * Should not contain any logic.
 */
var view = async (view) => {
    view.projectSettings = { useBootstrap: true, useDefaultCSS: true, useIndexFile: true };
    view.projectData = {};

    view.$useDefaultCSS.model = () => view.projectSettings.useDefaultCSS;
    view.$useBootstrap.model = () => view.projectSettings.useBootstrap;
    view.$useIndexFile.model = () => view.projectSettings.useIndexFile;
    view.$loader.show = () => !view.projectData;

    view.$createBtn.event.onclick = async () => {
        var promises = view._initProject();
        await Promise.all(promises);
        willCore("/folderExplorer", { route: "wwwRoot" });
    };

    view.projectExists = [willCoreModules.server, () => []];
    view.initProject = [willCoreModules.server, () => [view.projectSettings]];
    view._projectExists();

    view.projectData = (target, property, value) => {
        if (value && value.exists) {
            willCore("/folderExplorer", { route: "wwwRoot" });
        }
    }
};

export { view };