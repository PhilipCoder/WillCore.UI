/**
 * Event binding module 
 * 
 * @typedef {import("./confirm.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var events = async (view, logic) => {
    view.$okButton.event.onclick = () => {
        if (view._aggree) {
            view._aggree();
        }
        view.info.show = false;
    };
    view.$cancelButton.event.onclick = () => {
        view.info.show = false;
    };
};

export { events };