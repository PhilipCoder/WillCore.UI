import { server } from "/willcore/WillCore.js";
/**
 * Definition file for collection sources.
 * 
 * @typedef {import("./folderExplorer.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var sources = async (view, configuration) => {
    view.getFiles = [server, () => [view.route]];
    view._getFiles();
};

export { sources };