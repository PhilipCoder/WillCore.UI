const fileCreateModuleLoader = require("../../fileCreation/logic/fileCreateModuleLoader.js");
module.exports = (view) => {
    view.login = (view) => {
        if (view.loginData.userName == "admin" && view.loginData.password == "admin" && !view.session.authenticated()) {
            view.loginData.success = true;
            view.session.authenticate({ userName: view.loginData.userName });
        } else {
            view.loginData.success = false;
        }
        view.done();
    }
};