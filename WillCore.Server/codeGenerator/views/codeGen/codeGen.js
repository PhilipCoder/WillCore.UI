import { collections } from "./codeGen.collections.js";
import { bindings } from "./codeGen.bindings.js";
import { logic } from "./codeGen.logic.js";
import { events } from "./codeGen.events.js";
import { sources } from "./codeGen.sources.js";
import { traps } from "./codeGen.traps.js";
import { targets } from "./codeGen.targets.js";


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