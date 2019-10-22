import { collections } from "./confirmPrompt.collections.js";
import { bindings } from "./confirmPrompt.bindings.js";
import { logic } from "./confirmPrompt.logic.js";
import { events } from "./confirmPrompt.events.js";
import { sources } from "./confirmPrompt.sources.js";
import { traps } from "./confirmPrompt.traps.js";
import { targets } from "./confirmPrompt.targets.js";


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
    view.setLogic(logicInstance);
    events(view, logicInstance);
};

export { view };