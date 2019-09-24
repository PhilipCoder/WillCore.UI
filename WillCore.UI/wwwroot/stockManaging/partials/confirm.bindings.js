/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./confirm.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    view.$header.innerHTML = () => view.info.heading;
    view.$body.innerHTML = () => view.info.message;
    view.$modal.attribute.style = () => ({ display: view.info.show ? "flex" : "none" });
};

export { bindings };