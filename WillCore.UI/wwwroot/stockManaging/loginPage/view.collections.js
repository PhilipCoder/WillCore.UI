/**
 * Builds up the collections that are used by the view.
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var collections = async (view, configuration) => {
    view.userDetailCollection = { email: "", password: "", termsAndConditions: false };
    view.status = { countDown: configuration.countDownSeconds };
    view.validationResult = {};
};

export { collections };