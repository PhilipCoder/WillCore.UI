/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./viewAll.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    view.$infoLabel.innerHTML = () => "aa";
};

export { bindings };