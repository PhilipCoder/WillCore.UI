import { assignable } from "/willcore/assignable/assignable.js"
import { willCoreProxy } from "/willcore/ui.js";
import { router } from "../logic/router.js";;
import { uiProxy } from "../proxies/ui/uiProxy.js"

class component extends assignable {
    constructor() {
        super({}, willCoreProxy);
        this.router = null;
    }

    static get noValues() {
        return willCoreProxy;
    }

    completionResult() {
        return uiProxy.new(this.parentProxy,this.propertyName, this);
    }

    completed() {
        this.router = new router();
        if (window.location.hash.length === 0){
            this.router.navigate("/");
        }
    }
}

export { component };