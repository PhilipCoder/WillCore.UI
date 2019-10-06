/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./login.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    view.$counter.innerHTML = () => view.serverSideCounter.counter;
};

export { bindings };