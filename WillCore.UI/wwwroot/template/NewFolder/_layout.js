import { collections } from "./_layout.collections.js";
import { bindings } from "./_layout.bindings.js";
import { logic } from "./_layout.logic.js";
import { events } from "./_layout.events.js";
import { sources } from "./_layout.sources.js";
import { traps } from "./_layout.traps.js";
import { targets } from "./_layout.targets.js";


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