const configuration = {
};

/**
 * WillCore View: 
 * IOC binding that brings all the modules together for the view.
 * 
 * Should not contain any logic.
 */
var view = async (view) => {
    var specialCharCheckDot = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    var specialCharCheck = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;

    view.routeData = view.route.route ? view.route.route.split("/") : [];
    view.state = { canModifyFile: false };
    view.$routeBreadCrumb.repeat = () => view.routeData;
    var currentURLs = [];
    view.$routeBreadCrumb.repeat((elements, row, index) => {
        currentURLs = index === 0 ? [] : currentURLs;
        currentURLs.push(row);
        elements.$routeBreadCrumbLink.innerHTML = () => row;
        elements.$routeBreadCrumbLink.attribute.href = () => "#/folderExplorer?route=" + encodeURIComponent(currentURLs.join("/"));
    });

    //=======================Partials==============================
    view.$promptModal = [willCoreModules.partial, "/codeGen/views/partials/confirmPrompt/confirmPrompt.js", "/codeGen/views/partials/confirmPrompt/confirmPrompt.html", {}];
    view.$inputModal = [willCoreModules.partial, "/codeGen/views/partials/inputPrompt/inputPrompt.js", "/codeGen/views/partials/inputPrompt/inputPrompt.html", {}];

    view.$renameFile.event.onclick = () => promptNewFileName();
    view.$deleteView.event.onclick = () => promptDeleteFile();
    view.$renameFile.disabled = () => !view.state.canModifyFile;
    view.$deleteView.disabled = () => !view.state.canModifyFile;
    function setState() {
        var isViewMode = view.route.route.indexOf(".view") > -1;
        var currentFile = view.route.route.substring(0, view.route.route.indexOf("."));
        currentFile = currentFile.substring(currentFile.indexOf("/") + 1);
        view.state.canModifyFile = currentFile !== "index";
    }
    setState();
    view.route = (target, property, value) => {
        setState();
        if (value && property === "route") {
            view.routeData = value.split("/");
        }
    };

    var promptNewFileName = async () => {
        var result = await view.$inputModal.logic.show("Rename File Or View", "Enter New File/View Name", "Enter filename (without extension)...", "", async inputValue => {
            if (!inputValue || specialCharCheck.test(inputValue)) {
                return "Special characters not allowed!";
            }
            var creationValues = { filePath: view.route.route, newFileName: inputValue };
            var fileCreationResult = await willCoreModules.server.runRequest("editorLayout/renameFile", creationValues);
            if (typeof fileCreationResult !== "string") {
                var newURL = view.route.route.substring(0, view.route.route.lastIndexOf("/") + 1) + inputValue + ".view";
                willCore("/editor", { route: newURL });
            } else {
                return fileCreationResult;
            }
        });
    };

    var promptDeleteFile = async () => {
        var result = await view.$promptModal.logic.show("Are You Sure?", "Delete file?", async inputValue => {
            var creationValues = { filePath: view.route.route };
            await willCoreModules.server.runRequest("editorLayout/deleteFile", creationValues);
            var newURL = view.route.route.substring(0, view.route.route.lastIndexOf("/"));
            willCore("/folderExplorer", { route: newURL });
            return true;
        });
    };

};

export { view };