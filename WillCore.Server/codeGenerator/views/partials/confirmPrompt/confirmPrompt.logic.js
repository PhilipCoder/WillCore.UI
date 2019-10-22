/**
 * Logic module 
 * 
 * @typedef {import("./confirmPrompt.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var logic = (view, configuration) => {
    let result = {};
    result.show = (heading, label, okFunction) => {
        view.modalData.heading = heading;
        view.modalData.label = label;
        view.modalData.display = true;
        result.okFunction = okFunction;
        return new Promise((resolve, reject) => {
            result.resolve = resolve;
        });
    };
    return result;
};

export { logic };