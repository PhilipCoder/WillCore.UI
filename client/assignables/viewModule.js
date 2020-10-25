import { assignable } from "/willcore/assignable/assignable.js"
import { uiProxy } from "../proxies/ui/uiProxy.js"

let willcoreUIInstance = null;

class component extends assignable {
    constructor() {
        super({}, uiProxy);
    }

    completionResult() {
        return false;
    }

    completed() {
        this.parentProxy._assignable.parentProxy._viewModuleNames = this.parentProxy._assignable.parentProxy._viewModuleNames || [];
        this.parentProxy._assignable.parentProxy._viewModuleNames.push(this.propertyName);
    }
}

export { component, willcoreUIInstance };