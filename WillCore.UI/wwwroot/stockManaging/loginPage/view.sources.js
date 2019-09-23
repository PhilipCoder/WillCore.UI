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
    view.validationResult = () => [
        request,
        "POST",
        "/api/Login",
        { body: { Id: () => 0, EMail: () => view.userDetailCollection.email, Password: view.userDetailCollection.password } },
        {}
    ];
};

export { sources };