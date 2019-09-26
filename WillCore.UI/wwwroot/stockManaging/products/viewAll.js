import { collections } from "./viewAll.collections.js";
import { bindings } from "./viewAll.bindings.js";
import { logic } from "./viewAll.logic.js";
import { events } from "./viewAll.events.js";
import { sources } from "./viewAll.sources.js";
import { traps } from "./viewAll.traps.js";
import { targets } from "./viewAll.targets.js";


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