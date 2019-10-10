/**
 * Event binding module 
 * 
 * @typedef {import("./_fileExplorerLayout.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var events = async (view, logic) => {
    view.$createView.event.onclick = () => logic.promptViewName();
    view.$createLayout.event.onclick = () => logic.promptLayoutName();
    view.$createFolder.event.onclick = () => logic.promptFolderName();

};

export { events };