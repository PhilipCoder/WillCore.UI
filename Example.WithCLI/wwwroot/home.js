import { collections } from "./home.collections.js";
import { bindings } from "./home.bindings.js";
import { logic } from "./home.logic.js";
import { events } from "./home.events.js";
import { sources } from "./home.sources.js";
import { traps } from "./home.traps.js";
import { targets } from "./home.targets.js";


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