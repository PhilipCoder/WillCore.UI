import { collections } from "./$safeitemname$.collections.js";
import { bindings } from "./$safeitemname$.bindings.js";
import { logic } from "./$safeitemname$.logic.js";
import { events } from "./$safeitemname$.events.js";
import { sources } from "./$safeitemname$.sources.js";
import { targets } from "./$safeitemname$.targets.js";

class $safeitemnameNoDash$ extends HTMLElement {
    constructor() {
        super();
        this.view = null;
    }
    main(view) {
        collections(view);
        sources(view);
        targets(view);
        bindings(view);
        let logicInstance = logic(view);
        view.setLogic(logicInstance);
        events(view, logicInstance);
    }

    connectedCallback() {
        willCore["$safeitemname$"].load(this);
    }
}

export { $safeitemnameNoDash$ };