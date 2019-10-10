/**
 * Event binding module 
 * 
 * @typedef {import("./inputPrompt.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var events = async (view, logic) => {
    view.$okButton.event.onclick = () => {
        view.modalData.display = false;
        view.logic.resolve(view.modalData.inputValue);
    };
    view.$cancelButton.event.onclick = () => {
        view.modalData.display = false;
        view.logic.resolve(null);
    };
};

export { events };