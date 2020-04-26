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
        this.addClientAssignable("disabled", "/uiModules/bindings/disabled.js");
        this.addClientAssignable("hide", "/uiModules/bindings/hide.js");
        this.addClientAssignable("options", "/uiModules/bindings/options.js");
        this.addClientAssignable("show", "/uiModules/bindings/show.js");
        this.addClientAssignable("style", "/uiModules/bindings/style.js");
        this.addClientAssignable("attribute", "/uiModules/bindings/attribute.js");
    }


    completionResult() {
        this.parentProxy.views.files = "/";
        return false;
    }
}

module.exports = uiAssignable;