let path = require('path');
let fs = require("fs");
let qs = require('querystring');

let modules = {
    path: null,
    files: [],
    modules: {}
};

function walk(dir) {
    var that = this;
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}

modules.populate = function () {
    if (!modules.path) {
        modules.path = path.resolve(__dirname, `../../../../`);
        modules.files =
            walk(modules.path).
                filter(x => path.basename(x).
                    toLowerCase().
                    endsWith(".server.js")).
                map(x => path.resolve("./wwwRoot", x));

        modules.files.forEach(file => {
            var baseName = path.basename(file);
            var moduleName = baseName.substring(0, baseName.indexOf("."));
            modules.modules[moduleName] = modules.modules[moduleName] || {};
            require(file)(modules.modules[moduleName]);
        });
    }
}

module.exports = modules;