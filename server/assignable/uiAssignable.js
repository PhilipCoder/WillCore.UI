const coreUIAssignable = require("willcore.uicore/server/assignables/coreUIAssignable.js");

class uiAssignable extends coreUIAssignable {
    constructor() {
        super();
        this.fileServiceName = "uiModules";
        this.folderPath = "/client";
        this.addClientAssignable("ui", "/uiModules/assignables/uiAssignable.js");
        this.addClientAssignable("bind", "/uiModules/bindings/bind.js");
        this.addClientAssignable("model", "/uiModules/bindings/model.js");
        this.addClientAssignable("event", "/uiModules/bindings/event.js");
    }


    completionResult() {
        this.parentProxy.views.files = "/";
        return false;
    }
}

module.exports = uiAssignable;