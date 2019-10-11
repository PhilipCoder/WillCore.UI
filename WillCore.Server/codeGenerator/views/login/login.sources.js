/**
 * Definition file for collection sources.
 * 
 * @typedef {import("./login.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var sources = async (view, configuration) => {
    view.login = [willCoreModules.server, () => [view.loginData]];
    
};

export { sources };