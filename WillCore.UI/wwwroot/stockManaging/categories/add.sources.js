import { request } from "/willCore/WillCore.js";
/**
 * Definition file for collection sources.
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var sources = async (view, configuration) => {
    //Defines the category source, witch is the server.
    view.categoryRequestResult = () => [
        request,
        "GET",
        `${window.location.origin}/api/Category/${view.route.id}`,
        {},
        {}
    ];
    //Run the source if the category id is in the route
    if (view.route.id) view._categoryRequestResult();

    view.submittionResult = () => [
        request,
        view.route.id ? "PUT" : "POST",
        view.route.id ? `/api/Category/${view.route.id}` : "/api/Category",
        {
            body: { Id: () => 0, Name: () => view.formData.name, Desciption: view.formData.description, Image: () => view.formData.picture }
        },
        {}
    ];
};

export { sources };