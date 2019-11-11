/**
 * WillCore View: 
 * IOC binding that brings all the modules together for the view.
 * 
 * Should not contain any logic.
 */
var view = async (view) => {
    var specialCharCheckDot = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    var specialCharCheck = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;

    view.fileModules = await willCoreModules.server.runRequest("_fileExplorerLayout/getFileModules", {});
    view.routeData = view.route.route ? view.route.route.split("/") : [];
    let dropdowns = {};
    view.fileModules.modules.filter(x => !!x.folder).filter(module => {
        dropdowns[module.folder] = dropdowns[module.folder] || [];
        dropdowns[module.folder].push(module);
    });

    view.$menuDropdownNav.repeat = () => Object.keys(dropdowns);
    view.$menuDropdownNav.repeat((elements, row, index) => {
        elements.$menuDropdown.label = row;
        elements.$menuDropdown.items = dropdowns[row];
        elements.$menuDropdown.iterator = (menuElements, menuRow) => {
            menuElements.$link.innerHTML = () => menuRow.label;
            menuElements.$link.event.onclick = () => promptModuleFileName(menuRow.label, menuRow.name);
        };
    });

    view.$menuItem.repeat = () => view.fileModules.modules.filter(x => !x.folder);
    view.$menuItem.repeat((elements, row, index) => {
        elements.$menuItemLink.innerHTML = () => row.label;
        elements.$menuItemLink.event.onclick = () => promptModuleFileName(row.label, row.name);
    });

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
        if (value && property === "route") {
            view.routeData = value.split("/");
        }
    };

    var promptModuleFileName = async (moduleLabel, moduleName) => {
        var result = await view.$inputModal.logic.show(moduleLabel, "Enter Item Name", "Enter item name ( without file extension )", "", async inputValue => {
            if (!inputValue || specialCharCheck.test(inputValue)) {
                return "Special characters not allowed!";
            }
            var creationValues = { itemName: view.route.route + "\\" + inputValue, moduleName: moduleName };
            var fileCreationResult = await willCoreModules.server.runRequest("_fileExplorerLayout/createModuleFile", creationValues);
            if (fileCreationResult) {
                view.child._getFiles();
            } else {
                return "Duplicate file name!";
            }
        });
    };

    var promptFileName = async () => {
        var result = await view.$inputModal.logic.show("Create New File", "Enter File Name", "Enter filename ( with file extension )", "", async inputValue => {
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
    
    //view.$customDropdown.view.values.label = "testing";
    //var counter = 0;
    //window.setInterval(() => { counter++; view.$customDropdown.view.values.label = `${counter} testing`; }, 1000);
};

export { view };