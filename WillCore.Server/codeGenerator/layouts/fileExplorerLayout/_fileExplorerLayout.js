/**
 * WillCore View: 
 * IOC binding that brings all the modules together for the view.
 * 
 * Should not contain any logic.
 */
var view = async (view) => {
    view.routeData = view.route.route ? view.route.route.split("/") : [];

    view.$routeBreadCrumb.repeat = () => view.routeData;
    var currentURLs = [];
    view.$routeBreadCrumb.repeat((elements, row, index) => {
        currentURLs = index === 0 ? [] : currentURLs;
        currentURLs.push(row);
        elements.$routeBreadCrumbLink.innerHTML = () => row;
        elements.$routeBreadCrumbLink.attribute.href = () => "#/folderExplorer?route=" + encodeURIComponent(currentURLs.join("/"));
    });

    //=======================Partials==============================
    view.$inputModal = [willCoreModules.partial, "/codeGen/views/partials/inputPrompt/inputPrompt.js", "/codeGen/views/partials/inputPrompt/inputPrompt.html", {}];

    view.$createFile.event.onclick = () => promptLayoutName();
    view.$createFolder.event.onclick = () => promptFolderName();
    view.$createView.event.onclick = () => promptViewName();

    view.route = (target, property, value) => {
        if (value && property === "route") {
            view.routeData = value.split("/");
        }
    };

    var promptLayoutName = async () => {
        var result = await view.$inputModal.logic.show("Create New File", "Enter File Name", "Enter filename ( with file extensions )", "");
        if (result) {
            var creationValues = { itemName: view.route.route + "\\" + result };
            await willCoreModules.server.runRequest("_fileExplorerLayout/createFile", creationValues);
            view.child._getFiles();
        }
    };
    var promptFolderName = async () => {
        var result = await view.$inputModal.logic.show("Create New Folder", "Enter The Unique Name Of The Folder", "Enter folder name", "");
        if (result) {
            var creationValues = { itemName: view.route.route + "\\" + result };
            await willCoreModules.server.runRequest("_fileExplorerLayout/createFolder", creationValues);
            view.child._getFiles();
        }
    };
    var promptViewName = async () => {
        var result = await view.$inputModal.logic.show("Create New View", "Enter The Unique Name Of The View", "Enter view name (no extention)", "");
        if (result) {
            var creationValues = { itemName: view.route.route + "\\" + result };
            await willCoreModules.server.runRequest("_fileExplorerLayout/createView", creationValues);
            view.child._getFiles();
        }
    };
};

export { view };