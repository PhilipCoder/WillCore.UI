import { collections } from "./two.collections.js";
import { bindings } from "./two.bindings.js";
import { logic } from "./two.logic.js";
import { events } from "./two.events.js";
import { sources } from "./two.sources.js";
import { traps } from "./two.traps.js";
import { targets } from "./two.targets.js";


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