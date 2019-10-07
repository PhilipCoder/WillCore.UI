var path = require('path');
var fs = require("fs");

module.exports = (view) => {
    view.projectExists = (view) => {
        var dir = path.resolve(__dirname, `../../config/project.json`);
        view.projectData = { exists: fs.existsSync(dir) };
        view.done();
    }
};