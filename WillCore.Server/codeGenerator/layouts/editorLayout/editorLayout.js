const configuration = {
};

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

    
};

export { view };