/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./inputPrompt.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    view.$modal.show = () => view.modalData.display;
    view.$header.innerHTML = () => view.modalData.heading;
    view.$modalLabel.innerHTML = () => view.modalData.label;
    view.$modalInput.attribute.placeholder = () => view.modalData.inputPlaceHolder;
    view.$modalInput.model = () => view.modalData.inputValue;
    view.$errorAlert.show = () => view.warningData.errorMsg;
    view.$errorMsg.innerHTML = () => view.warningData.errorMsg;
    view.$errorAlert.attribute.css = () => ({ 'is-invalid': view.warningData.errorMsg });
    view.$okButton.disabled = (errorMsg = view.warningData.errorMsg, inputValue = view.modalData.inputValue) => errorMsg || !inputValue || inputValue.length < 1;
};

export { bindings };