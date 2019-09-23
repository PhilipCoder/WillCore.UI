import { collections } from "./one.collections.js";
import { bindings } from "./one.bindings.js";
import { logic } from "./one.logic.js";
import { events } from "./one.events.js";
import { sources } from "./one.sources.js";
import { traps } from "./one.traps.js";
import { targets } from "./one.targets.js";


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
    providers(view, configuration);
    traps(view, configuration);
    pipes(view, configuration);
    bindings(view);
    let logicInstance = logic(view, configuration);
    events(view, logicInstance);
};

export { view };