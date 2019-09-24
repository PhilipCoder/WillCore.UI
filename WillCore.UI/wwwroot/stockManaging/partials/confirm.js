import { collections } from "./confirm.collections.js";
import { bindings } from "./confirm.bindings.js";
import { logic } from "./confirm.logic.js";
import { events } from "./confirm.events.js";
import { sources } from "./confirm.sources.js";
import { traps } from "./confirm.traps.js";
import { targets } from "./confirm.targets.js";


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