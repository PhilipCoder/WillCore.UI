var path = require('path');
var fs = require("fs");

var modules = {
    path: null,
    files: [],
    modules: {}
};

class viewServer {
    constructor() {
        if (!modules.path) {
            modules.path = path.resolve(__dirname, `../../wwwRoot`);
            modules.files = fs.
                readdirSync(modules.path).
                filter(x => path.basename(x).
                    toLowerCase().
                    endsWith(".server.js")).
                map(x => path.resolve("./wwwRoot", x));

            modules.files.forEach(file => {
                require(file)(modules.modules);
            });
        }
    }

    runMethod(viewName, methodName, methodBody) {
        if (!module.modules[viewName]) return `View ${viewName} not found!`;
        if (!module.modules[viewName][methodName]) return `Method ${methodName} on view ${viewName} not found!`;
        await module.modules[viewName][methodName](methodBody);
    }
}

module.exports = new viewServer();