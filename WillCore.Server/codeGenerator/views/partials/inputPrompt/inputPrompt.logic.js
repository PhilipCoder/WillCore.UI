/**
 * Logic module 
 * 
 * @typedef {import("./inputPrompt.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var logic = (view, configuration) => {
    let result = {};
    result.show = (heading, label, inputPlaceHolder, inputValue) => {
        view.modalData.heading = heading;
        view.modalData.label = label;
        view.modalData.inputPlaceHolder = inputPlaceHolder;
        view.modalData.display = true;
        view.modalData.inputValue = inputValue;
        return new Promise((resolve, reject) => {
            result.resolve = resolve;
        });
    };
    return result;
};

export { logic };