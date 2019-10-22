/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./confirmPrompt.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    view.$modal.show = () => view.modalData.display;
    view.$header.innerHTML = () => view.modalData.heading;
    view.$modalLabel.innerHTML = () => view.modalData.label;
};

export { bindings };