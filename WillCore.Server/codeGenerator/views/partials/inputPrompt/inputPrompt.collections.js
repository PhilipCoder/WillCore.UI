/**
 * Builds up the collections that are used by the view.
 * 
 * @typedef {import("./inputPrompt.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var collections = async (view, configuration) => {
    view.modalData = { display: false, heading:"Create New View", label:"Enter View Name", inputPlaceHolder:"Enter Name", inputValue:"viewAll" };
};

export { collections };