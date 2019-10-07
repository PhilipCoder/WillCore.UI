/**
 * Event binding module 
 * 
 * @typedef {import("./login.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var events = async (view, logic) => {
    view.$submitButton.event.onclick = () => view._login();
};

export { events };