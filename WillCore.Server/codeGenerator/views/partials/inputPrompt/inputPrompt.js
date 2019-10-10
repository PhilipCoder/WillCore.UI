import { collections } from "./inputPrompt.collections.js";
import { bindings } from "./inputPrompt.bindings.js";
import { logic } from "./inputPrompt.logic.js";
import { events } from "./inputPrompt.events.js";
import { sources } from "./inputPrompt.sources.js";
import { traps } from "./inputPrompt.traps.js";
import { targets } from "./inputPrompt.targets.js";


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