import { collections } from "./navbarLayout.collections.js";
import { bindings } from "./navbarLayout.bindings.js";
import { logic } from "./navbarLayout.logic.js";
import { events } from "./navbarLayout.events.js";

const configuration = {
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