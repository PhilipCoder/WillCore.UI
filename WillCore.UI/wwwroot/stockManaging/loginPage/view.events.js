/**
 * Event binding module 
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var events = async (view, logic) => {
    //login button click event
    view.$submitButton.event.onclick = async () => {
        view._validationResult(); //run the user detail verification request.
        await view.validationResult;
        if (view.validationResult.success) {
            logic.navigateOnSuccess();
        }
    };
};

export { events };