/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./folderExplorer.meta.js").viewMetaData} view
 * @param {view} view
 */
var imagePaths = {
    ".css": "/codeGen/images/fileIcons/css.png",
    "none": "/codeGen/images/fileIcons/file.png",
    "folder": "/codeGen/images/fileIcons/folder.png",
    ".gif": "/codeGen/images/fileIcons/gif.png",
    ".html": "/codeGen/images/fileIcons/html.png",
    ".js": "/codeGen/images/fileIcons/js.png",
    ".png": "/codeGen/images/fileIcons/png.png",
    ".svg": "/codeGen/images/fileIcons/svg.png"
};

var bindings = async (view) => {
    //================binds the file view==========================
    view.$fileCard.repeat = () => view.files;
    view.$fileCard.repeat((elements, row, index) => {
        elements.$fileNameLabel.innerHTML = () => row.fileNameWithExtension;
        elements.$cardImg.attribute.src = () => !row.fileExtention ? imagePaths.folder : imagePaths[row.fileExtention] ? imagePaths[row.fileExtention] : imagePaths.none;
        if (!row.fileExtention) {
            elements.$fileCard.attribute.href = () => "#/folderExplorer?route=" + encodeURIComponent(view.route.route + "/" + row.fileNameWithExtension);
        }
    });
    

};

export { bindings };