class init_intellisense {
    constructor(moduleInfo) {
        this.moduleInfo = moduleInfo;
    }
    
    get values(){
        return this.loadAppFile() || this.loadServiceFile();
    }

    loadAppFile() {
        if (this.moduleInfo.isServerSide) {
            if (this.moduleInfo.mainName) {
                return [{
                    type: "core",
                    description: "Main WillCore module.",
                    parentType: null,
                    name: this.moduleInfo.mainName
                }];
            }
        }
        return undefined;
    }

    loadServiceFile() {
        if (this.moduleInfo.isServerSide) {
            if (this.moduleInfo.parameters) {
                let result = [];
                if (this.moduleInfo.parameters.length > 0) {
                    result.push({
                        type: "service",
                        description: "WillCore service instance.",
                        parentType: null,
                        name: this.moduleInfo.parameters[0]
                    });
                }
                if (this.moduleInfo.parameters.length > 1) {
                    result.push({
                        type: "server",
                        description: "WillCore server instance.",
                        parentType: null,
                        name: this.moduleInfo.parameters[1]
                    });
                }
                if (this.moduleInfo.parameters.length > 2) {
                    result.push({
                        type: "core",
                        description: "Main WillCore module.",
                        parentType: null,
                        name: this.moduleInfo.parameters[2]
                    });
                }
                return result;
            }
        }
        return undefined;
    }
}

module.exports = init_intellisense;