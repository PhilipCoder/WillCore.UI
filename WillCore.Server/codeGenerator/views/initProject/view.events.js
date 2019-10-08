/**
 * Event binding module 
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var events = async (view, logic) => {
    view.$createBtn.event.onclick =async () => {
        await Promise.all(view._initProject());
        alert("done");
    };
};

export { events };