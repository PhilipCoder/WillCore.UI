/**
 * Builds up the collections that are used by the view.
 * 
 * @typedef {import("./home.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var collections = async (view, configuration) => {
    view.greeting = { message: "Hello World" };
};

export { collections };