import { collections } from "./folderExplorer.collections.js";
import { bindings } from "./folderExplorer.bindings.js";
import { logic } from "./folderExplorer.logic.js";
import { events } from "./folderExplorer.events.js";
import { sources } from "./folderExplorer.sources.js";
import { traps } from "./folderExplorer.traps.js";
import { targets } from "./folderExplorer.targets.js";


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