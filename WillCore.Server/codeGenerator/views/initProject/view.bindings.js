/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    view.$useDefaultCSS.model = () => view.projectSettings.useDefaultCSS;
    view.$useBootstrap.model = () => view.projectSettings.useBootstrap;
    view.$useIndexFile.model = () => view.projectSettings.useIndexFile;
};

export { bindings };