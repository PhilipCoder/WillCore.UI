import { request } from "/willCore/WillCore.js";
/**
 * Definition file for collection sources.
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var sources = async (view, configuration) => {
    //defines the validation result source, used to execute the login action
    view.categoryRequestResult = () => [
        request,
        "GET",
        `${window.location.origin}/api/Category/${view.route.id}`,
        {},
        {}
    ];
    if (view.route.id) view._categoryRequestResult();
};

export { sources };