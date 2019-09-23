import { willCore, request } from "../../willCore/WillCore.js";

var logic = (view, configuration) => {
    return {
        submitForm: async () => {
            view.submittionResult = [request, "POST", "/api/Category", { body: { Id: () => 0, Name: () => view.formData.name, Desciption: view.formData.description, Image: view.formData.picture } }, {}];
            await view.submittionResult;
            willCore("/categories");
        }
    }
};

export { logic };