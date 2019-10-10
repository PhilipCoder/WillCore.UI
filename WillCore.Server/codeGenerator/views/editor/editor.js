import { collections } from "./editor.collections.js";
import { bindings } from "./editor.bindings.js";
import { logic } from "./editor.logic.js";
import { events } from "./editor.events.js";
import { sources } from "./editor.sources.js";
import { traps } from "./editor.traps.js";
import { targets } from "./editor.targets.js";


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