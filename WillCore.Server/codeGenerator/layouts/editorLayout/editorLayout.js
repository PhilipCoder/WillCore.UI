import { collections } from "./editorLayout.collections.js";
import { bindings } from "./editorLayout.bindings.js";
import { logic } from "./editorLayout.logic.js";
import { events } from "./editorLayout.events.js";
import { sources } from "./editorLayout.sources.js";
import { traps } from "./editorLayout.traps.js";
import { targets } from "./editorLayout.targets.js";


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