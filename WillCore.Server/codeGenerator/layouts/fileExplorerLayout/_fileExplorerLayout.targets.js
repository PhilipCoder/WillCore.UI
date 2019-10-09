/**
 * Definition file for collection targets.
 * 
 * @typedef {import("./_fileExplorerLayout.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var targets = async (view, configuration) => {
    view.route = (target, property, value) => {
        if (value && property === "route") {
            view.routeData = value.split("/");
        }
    }
};

export { targets };