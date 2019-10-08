import { server } from "/willcore/WillCore.js";

/**
 * Definition file for collection sources.
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var sources = async (view, configuration) => {
    view.projectExists = [server, () => []];
    view.initProject = [server, () => [view.projectSettings]];
    view._projectExists();
};

export { sources };