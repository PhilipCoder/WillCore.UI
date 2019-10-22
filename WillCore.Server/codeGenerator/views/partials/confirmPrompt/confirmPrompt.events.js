/**
 * Event binding module 
 * 
 * @typedef {import("./confirmPrompt.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var events = async (view, logic) => {
    view.$okButton.event.onclick = async () => {
        var validateMessage = null;
        if (logic.okFunction) {
            await logic.okFunction(view.modalData.inputValue);
        }
        view.modalData.display = false;
        view.logic.resolve(true);
    };
    view.$cancelButton.event.onclick = () => {
        view.modalData.display = false;
        view.logic.resolve(null);
    };
};

export { events };