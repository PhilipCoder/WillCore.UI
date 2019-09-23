import { collections } from "./view.collections.js";
import { bindings } from "./view.bindings.js";
import { logic } from "./view.logic.js";
import { events } from "./view.events.js";
import { sources } from "./view.sources.js";
import { traps } from "./view.traps.js";
import { targets } from "./view.targets.js";


const configuration = {
    countDownSeconds: 4,
    landingPage: "/categories"
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