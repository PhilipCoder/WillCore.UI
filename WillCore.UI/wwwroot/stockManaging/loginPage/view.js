import { collections } from "./view.collections.js";
import { bindings } from "./view.bindings.js";
import { logic } from "./view.logic.js";
import { events } from "./view.events.js";

const configuration = {
    countDownSeconds: 4,
    landingPage: "/categories"
};

/**
 * IOC binding that brings all the modules together for the view
 * @param {View} view
 */
var view = async (view) => {
    collections(view, configuration);
    bindings(view);
    let logicInstance = logic(view, configuration);
    events(view, logicInstance);
};

export { view };