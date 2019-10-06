import { server } from "/willcore/WillCore.js";

/**
 * Definition file for collection sources.
 * 
 * @typedef {import("./login.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var sources = async (view, configuration) => {
    view.login = [server, () => [view.loginData]];
    view._login();
};

export { sources };