/**
 * Builds up the collections that are used by the view.
 * 
 * @typedef {import("./confirmPrompt.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var collections = async (view, configuration) => {
    view.modalData = { display: false, heading: "Create New Viewsss", label: "Enter View Name" };
};

export { collections };