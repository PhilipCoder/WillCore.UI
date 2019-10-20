/**
 * Event binding module 
 * 
 * @typedef {import("./inputPrompt.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var events = async (view, logic) => {
    view.$okButton.event.onclick = async () => {
        var validateMessage = null;
        if (logic.okFunction) {
            validateMessage = await logic.okFunction(view.modalData.inputValue);
            if (validateMessage) {
                view.warningData.errorMsg = validateMessage;
            }
        }
        view.modalData.display = !!validateMessage;
        view.logic.resolve(view.modalData.inputValue);
    };
    view.$cancelButton.event.onclick = () => {
        view.modalData.display = false;
        view.logic.resolve(null);
    };
};

export { events };