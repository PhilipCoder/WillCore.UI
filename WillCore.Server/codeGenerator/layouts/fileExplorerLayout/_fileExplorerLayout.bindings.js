/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./_fileExplorerLayout.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    //Bind the bread crumbs to the URL
    view.$routeBreadCrumb.repeat = () => view.routeData;
    var currentURLs = [];
    view.$routeBreadCrumb.repeat((elements, row, index) => {
        currentURLs = index === 0 ? [] : currentURLs;
        currentURLs.push(row);
        elements.$routeBreadCrumbLink.innerHTML = () => row;
        elements.$routeBreadCrumbLink.attribute.href = () => "#/folderExplorer?route=" + encodeURIComponent(currentURLs.join("/"));

    });
};

export { bindings };