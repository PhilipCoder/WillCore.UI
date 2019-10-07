/**
 * Builds up the collections that are used by the view.
 * 
 * @typedef {import("./login.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var collections = async (view, configuration) => {
    view.loginData = { userName: "", password: "" };
};

export { collections };