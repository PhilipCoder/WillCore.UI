/**
 * Builds up the collections that are used by the view.
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var collections = async (view, configuration) => {
    view.projectSettings = { useBootstrap: true, useDefaultCSS: true, useIndexFile: true };
    view.projectData = {};

};

export { collections };