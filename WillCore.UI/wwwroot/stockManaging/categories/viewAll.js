﻿import { collections } from "./viewAll.collections.js";
import { bindings } from "./viewAll.bindings.js";
import { logic } from "./viewAll.logic.js";
import { events } from "./viewAll.events.js";

const configuration = {
};

/**
 * IOC binding that brings all the modules together for the view
 * @param {View} view
 */
var view = async (view) => {
    await collections(view, configuration);
    bindings(view);
    let logicInstance = logic(view, configuration);
    events(view, logicInstance);
};

export { view };