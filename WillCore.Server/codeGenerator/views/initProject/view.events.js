/**
 * Event binding module 
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var events = async (view, logic) => {
    view.$createBtn.event.onclick = async () => {
        var promises = view._initProject();
        await Promise.all(promises);
        willCore("/folderExplorer", { route:"wwwRoot"});
    };
};

export { events };