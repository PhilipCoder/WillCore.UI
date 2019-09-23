import { collections } from "./formPage.collections.js";
import { bindings } from "./formPage.bindings.js";
import { logic } from "./formPage.logic.js";
import { events } from "./formPage.events.js";
import { sources } from "./formPage.sources.js";
import { traps } from "./formPage.traps.js";
import { targets } from "./formPage.targets.js";


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