import { collections } from "./$safeitemname$.collections.js";
import { bindings } from "./$safeitemname$.bindings.js";
import { logic } from "./$safeitemname$.logic.js";
import { events } from "./$safeitemname$.events.js";
import { sources } from "./$safeitemname$.sources.js";
import { targets } from "./$safeitemname$.targets.js";

class bootstrapDropdown extends HTMLElement {
    constructor() {
        super();
        this.view = null;
        willCore["$safeitemname$"].load(this);
    }
    main(view) {
        collections(view);
    }

    connectedCallback() {
        sources(view);
        targets(view);
        bindings(view);
        let logicInstance = logic(view);
        events(view, logicInstance);
    }
}

export { bootstrapDropdown };