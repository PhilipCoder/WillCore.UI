import { collections } from "./_fileExplorerLayout.collections.js";
import { bindings } from "./_fileExplorerLayout.bindings.js";
import { logic } from "./_fileExplorerLayout.logic.js";
import { events } from "./_fileExplorerLayout.events.js";
import { sources } from "./_fileExplorerLayout.sources.js";
import { traps } from "./_fileExplorerLayout.traps.js";
import { targets } from "./_fileExplorerLayout.targets.js";


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