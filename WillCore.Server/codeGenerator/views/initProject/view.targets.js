/**
 * Definition file for collection targets.
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var targets = async (view, configuration) => {
    view.projectData = (target, property, value) => {
        if (value && value.exists) {
            willCore("/folderExplorer", { route: "wwwRoot" });
        }
    }
};

export { targets };