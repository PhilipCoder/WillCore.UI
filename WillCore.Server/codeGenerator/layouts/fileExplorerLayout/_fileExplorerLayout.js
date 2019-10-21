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

    view.$createFile.event.onclick = () => promptFileName();
    view.$createFolder.event.onclick = () => promptFolderName();
    view.$createView.event.onclick = () => promptViewName();

    view.route = (target, property, value) => {
        console.log(value);
        console.log(property);

        if (value && property === "route") {
            view.routeData = value.split("/");
        }
    };

    var promptFileName = async () => {
        var result = await view.$inputModal.logic.show("Create New File", "Enter File Name", "Enter filename ( with file extensions )", "", async inputValue => {
            if (!inputValue || (!inputValue.endsWith(".js") && !inputValue.endsWith(".html") && !inputValue.endsWith(".json"))) {
                return "Only JavaScript, HTML and JSON files allowed!";
            }
            if (!inputValue || specialCharCheck.test(inputValue)) {
                return "Special characters not allowed!";
            }
            var creationValues = { itemName: view.route.route + "\\" + inputValue };
            var fileCreationResult = await willCoreModules.server.runRequest("_fileExplorerLayout/createFile", creationValues);
            if (fileCreationResult) {
                view.child._getFiles();
            } else {
                return "Duplicate file name!";
            }
        });
    };
    var promptFolderName = async () => {
        view.$inputModal.logic.show("Create New Folder", "Enter The Unique Name Of The Folder", "Enter folder name", "", async inputValue => {
            if (!inputValue || specialCharCheck.test(inputValue)) {
                return "Special characters not allowed!";
            }
            var creationValues = { itemName: view.route.route + "\\" + inputValue };
            var folderCreationResult = await willCoreModules.server.runRequest("_fileExplorerLayout/createFolder", creationValues);
            if (folderCreationResult) {
                view.child._getFiles();
            } else {
                return "Duplicate folder name!";
            }
        });
    };
    var promptViewName = async () => {
        var result = await view.$inputModal.logic.show("Create New View", "Enter The Unique Name Of The View", "Enter view name (no extention)", "", async inputValue => {
            if (!inputValue || specialCharCheckDot.test(inputValue)) {
                return "Special characters not allowed!";
            }
            var creationValues = { itemName: view.route.route + "\\" + inputValue };
            var creationResult = await willCoreModules.server.runRequest("_fileExplorerLayout/createView", creationValues);
            if (creationResult) {
                view.child._getFiles();
            } else {
                return "Duplicate view name!";
            }
        });
    };
};

export { view };