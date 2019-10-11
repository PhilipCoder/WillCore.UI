import { server } from "/willcore/WillCore.js";

/**
 * Definition file for collection sources.
 * 
 * @typedef {import("./_fileExplorerLayout.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var sources = async (view, configuration) => {
    view.createFolder = [server, () => [view.creationValues]];
};

export { sources };