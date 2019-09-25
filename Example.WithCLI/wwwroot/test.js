import { collections } from "./test.collections.js";
import { bindings } from "./test.bindings.js";
import { logic } from "./test.logic.js";
import { events } from "./test.events.js";
import { sources } from "./test.sources.js";
import { traps } from "./test.traps.js";
import { targets } from "./test.targets.js";


const configuration = {
};

/**
 * WillCore View: 
 * IOC binding that brings all the modules together for the view.
 * 
 * Should not contain any logic.
 */
var view = async (view) => {
    collections(view, configuration);
    sources(view, configuration);
    traps(view, configuration);
    targets(view, configuration);
    bindings(view);
    let logicInstance = logic(view, configuration);
    events(view, logicInstance);
};

export { view };