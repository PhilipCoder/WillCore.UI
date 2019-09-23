import { collections } from "./htmlpage.collections.js";
import { bindings } from "./htmlpage.bindings.js";
import { logic } from "./htmlpage.logic.js";
import { events } from "./htmlpage.events.js";
import { sources } from "./htmlpage.sources.js";
import { traps } from "./htmlpage.traps.js";
import { targets } from "./htmlpage.targets.js";


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