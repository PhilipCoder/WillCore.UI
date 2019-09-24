import { willCore, request } from "../../willCore/WillCore.js";

var logic = (view, configuration) => {
    return {
        submitForm: async () => {
            view._submittionResult();
            await view.submittionResult;
            willCore("/categories");
        }
    }
};

export { logic };