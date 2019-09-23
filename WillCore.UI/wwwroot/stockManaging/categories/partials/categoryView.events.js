import { request } from "../../willCore/WillCore.js";

var events = async (view, logic) => {
    view.$submitButton.event.onclick = async () => {
        logic.submitForm();
    };
};

export { events };