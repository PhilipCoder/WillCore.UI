/**
 * Definition file for collection targets.
 * 
 * @typedef {import("./login.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var targets = async (view, configuration) => {
    view.loginData = (target, property, value) => {
        if (value && value.success) {
            willCore("/initProject");
        }
    }
};

export { targets };