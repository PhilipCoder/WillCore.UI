/**
 * Builds up the collections that are used by the view.
 * 
 * @typedef {import("./confirm.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var collections = async (view, configuration) => {
    if (!view.info) view.info = { heading: "Please Confirm", message: "Are you sure?", show: true };
};

export { collections };