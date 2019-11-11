const configuration = {
};

/**
 * WillCore View: 
 * IOC binding that brings all the modules together for the view.
 * 
 * Should not contain any logic.
 */
var view = async (view) => {
    view.projectExists = await willCoreModules.server.runRequest("codeGenInitProject/projectExists", {});
    if (view.projectExists.exists) {
        willCore("/folderExplorer", { route: "wwwRoot" });
    }
    view.projectSettings = { useBootstrap: true, useDefaultCSS: true, useIndexFile: true };
    view.projectData = {};

    //view.$useDefaultCSS.model = () => view.projectSettings.useDefaultCSS;
    //view.$useBootstrap.model = () => view.projectSettings.useBootstrap;
    //view.$useIndexFile.model = () => view.projectSettings.useIndexFile;
    console.log(view.projectExists.viewModules);
    view.$viewModuleItem.repeat = () => view.projectExists.modules;
    view.$viewModuleItem.repeat((elements, row, index) => {
        row.selected = row.optional === false;
        elements.$viewModuleIcon.attribute.src = () => row.icon;
        elements.$viewModuleLabel.innerHTML = () => row.label;
        elements.$viewModuleDescription.innerHTML = () => row.description;
        elements.$viewModuleCheck.disabled = () => row.optional === false;
        elements.$viewModuleCheck.model = () => row.selected;
    });

    view.$loader.show = () => !view.projectData;

    view.$createBtn.event.onclick = async () => {
        var result = await willCoreModules.server.runRequest("codeGenInitProject/initProject", {
            creationModules: view.projectExists.modules.filter(x => x.selected).map(x => x.name)
        });
        willCore("/folderExplorer", { route: "wwwRoot" });
    };


    view.initProject = [willCoreModules.server, () => [view.projectSettings, view.modules]];

};

export { view };