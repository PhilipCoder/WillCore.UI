import { collections } from "./login.collections.js";
import { bindings } from "./login.bindings.js";
import { logic } from "./login.logic.js";
import { events } from "./login.events.js";
import { sources } from "./login.sources.js";
import { traps } from "./login.traps.js";
import { targets } from "./login.targets.js";


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