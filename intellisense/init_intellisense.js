class init_intellisense {
    constructor(moduleInfo) {
        this.moduleInfo = moduleInfo;
    }
    
    get values(){
        return this.loadViewFile();
    }

    loadViewFile() {
        if (!this.moduleInfo.isServerSide) {
            let view = this.moduleInfo.functionsParameters.filter(x=>x[0] === "view");
            view = view.length > 0 ? view[0] : null;
            if (view) {
                let result = [];
                if (view.length > 1) {
                    result.push({
                        type: "viewModel",
                        description: "View model.",
                        parentType: null,
                        name: view[1]
                    });
                }
                if (view.length > 2) {
                    result.push({
                        type: "uiProxy",
                        description: "UI model.",
                        parentType: null,
                        name: view[2]
                    });
                }
                if (view.length > 3) {
                    result.push({
                        type: "requestsProxy",
                        description: "Request Proxy.",
                        parentType: null,
                        name: view[3]
                    });
                }
                if (view.length > 4) {
                    result.push({
                        type: "eventsProxy",
                        description: "Events proxy.",
                        parentType: null,
                        name: view[4]
                    });
                }
                return result;
            }
        }
        return undefined;
    }
}

module.exports = init_intellisense;