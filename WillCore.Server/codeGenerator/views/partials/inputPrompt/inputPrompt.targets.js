/**
 * Definition file for collection targets.
 * 
 * @typedef {import("./inputPrompt.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var targets = async (view, configuration) => {
    view.modalData = (target, property, value) => {
        if (property === "inputValue") {
            view.warningData.errorMsg = "";
        }
    }
};

export { targets };