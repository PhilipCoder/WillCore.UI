import { moduleProxy } from "./Modules.js";

//=========WillCore======================================
var coreProxyHander = {
    get: function (target, property) {
        if (willCoreModules.getDefaultElement.statement(target, property)) {
            return willCoreModules.getDefaultElement.result(target, property);
        }
        else if (willCoreModules.getDefaultView.statement(target, property, WillCoreInstance)) {
            return willCoreModules.getDefaultView.result(target, property);
        }
        return target[property];
    },

    set: function (target, property, value) {
        if (willCoreModules.setDefaultView.statement(target, property, value)) {
            willCoreModules.setDefaultView.result(target, property, value);
        }
        else if (willCoreModules.setDefaultPromise.statement(target, property, value)) {
            willCoreModules.setDefaultPromise.result(target, property, value);
        }
        else if (willCoreModules.setLayoutInstance.statement(target, property, value)) {
            willCoreModules.setLayoutInstance.result(target, property, value);
        }
        else if (willCoreModules.setDefaultAssignable.statement(target, property, value)) {
            willCoreModules.setDefaultAssignable.result(target, property, value);
        }
        else if (Array.isArray(value)) {
            value.forEach(x => coreProxyHander.set(target, property, x));
        }
        else {
            willCoreModules.execptionHander.handleExeception("Unsupported Assignment", `Views can only take element, URL and route assignments.`);
        }
        return true;
    }
}

var WillCoreInstance = {
    router: willCoreModules.router,
    _init: false,
    willCore: new Proxy(willCoreModules.routerFunction, coreProxyHander),
};

willCoreModules.router.setCoreProxy(WillCoreInstance.willCore);

var mainInstance = WillCoreInstance.willCore;
window.willCore = mainInstance;
export {
    mainInstance as willCore
};