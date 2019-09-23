import { request } from "../../willCore/WillCore.js";
var events = async (view, logic) => {
    view.$submitButton.event.onclick = async () => {
        view.validationResult = [request, "POST", "/api/Login", { body: { Id: () => 0, EMail: () => view.userDetailCollection.email, Password: view.userDetailCollection.password }}, {}];
        await view.validationResult;
        if (view.validationResult.success) {
            logic.navigateOnSuccess();
        }
    };
};

export { events };