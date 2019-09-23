import { willCore, request } from "../../willCore/WillCore.js";

/**
 * Builds up the collections that are used by the view
 * @param {any} view
 */
var collections = async (view, configuration) => {
    return new Promise(async(resolve, reject) => {
        view.categories = [request, "GET", window.location.origin + "/api/Category", {}, {}];
        await view.categories;
        resolve();
    });
};

export { collections };