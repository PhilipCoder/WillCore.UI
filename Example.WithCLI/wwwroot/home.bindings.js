/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./home.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    view.$greetingOutput.innerHTML = () => view.greeting.message;
};

export { bindings };