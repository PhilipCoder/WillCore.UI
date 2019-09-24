import { collections } from "./add.collections.js";
import { bindings } from "./add.bindings.js";
import { logic } from "./add.logic.js";
import { events } from "./add.events.js";
import { sources } from "./add.sources.js";
import { targets } from "./add.targets.js";

const configuration = {
};

/**
 * IOC binding that brings all the modules together for the view
 * @param {View} view
 */
var view = async (view) => {
    collections(view, configuration);
    sources(view, configuration);
    targets(view, configuration);
    bindings(view);
    let logicInstance = logic(view, configuration);
    events(view, logicInstance);
};

export { view };