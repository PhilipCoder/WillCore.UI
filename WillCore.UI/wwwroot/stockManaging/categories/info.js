import { collections } from "./info.collections.js";
import { bindings } from "./info.bindings.js";
import { logic } from "./info.logic.js";
import { events } from "./info.events.js";

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