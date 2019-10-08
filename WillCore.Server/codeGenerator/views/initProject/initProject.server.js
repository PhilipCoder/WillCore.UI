var projectFile = require("../../serverLogic/projectFile.js");

module.exports = (view) => {
    view.projectExists = (view) => {
        view.projectData = { exists: projectFile.exists() };
        view.done();
    }
    view.initProject = (view) => {
        projectFile.init(view.projectSettings.useBootstrap, view.projectSettings.useIndexFile, view.projectSettings.useDefaultCSS);
        view.done();
    };
};