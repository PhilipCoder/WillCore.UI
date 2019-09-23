import { collections } from "./$safeitemname$.collections.js";
import { bindings } from "./$safeitemname$.bindings.js";
import { logic } from "./$safeitemname$.logic.js";
import { events } from "./$safeitemname$.events.js";
import { sources } from "./$safeitemname$.sources.js";
import { traps } from "./$safeitemname$.traps.js";
import { targets } from "./$safeitemname$.targets.js";


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