const willCoreProxy = require("willcore.core");
const path = require("path");
const exec = require('child_process').exec
const willCoreModules = require("willcore.core/moduleContainer/willCoreModules.js");

describe('models-test', function () {
    before(async function () {
        require('module-alias/register');
    });
    it('action-model-test', function () {
        let viewDir = path.normalize(`${__dirname}/..`);
        let core = willCoreProxy.new();
        core.testServer.server[viewDir] = 8580;
        core.testServer.http;
        core.testServer.ui;
        core.testServer.loaderButton.scriptModule = "/views/zElement/loaderButton.js";
        core.testServer.product.service = "/zService/product.js";
        core.testServer.ui.open();
        exec('start chrome http://localhost:8580', function (err) { });
    });
});