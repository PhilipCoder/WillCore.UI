import { moduleProxy } from "./Modules.js";

//=========WillCore======================================
var coreProxyHander = {
    get: function (target, property) {
        if (!target[property] && property.startsWith("$")) {
            var elementId = property.substring(1);
            var element = new willCoreModules.idManager(null).getElement(elementId);
            return element || document.createElement("div");
        }
        else if (!target[property] || WillCoreInstance._init) {
            target[property] = willCoreModules.viewFactory.getView(property, target);
        }
        return target[property];
    },

    set: function (target, property, value) {
        if (value && value.nodeType === 1) {
            value = value.element || value;
            if (!target[property]) {
                target[property] = willCoreModules.viewFactory.getView(property, target);
            }
            if (target[property].viewManager.element) {
                willCoreModules.execptionHander.handleExeception("Invalid Operation", `The DOM element for view is already assigned.`);
            }
            target[property].viewManager.element = value.id;
        } else if (typeof value.then !== "undefined") {
            return true;
        }
        else if (value.getInstanceFactory) {
            target[property] = value.getInstanceFactory(target, property, value);
        } else if (value.assignmentMethods && value.assignmentMethods.assignmentMethod) {
            value.assignmentMethods.assignmentMethod(target, property, value);
        }
        else if (target[property] instanceof willCoreModules.assignable) {
            target[property].assign(value);
        } else if (Array.isArray(value)) {
            value.forEach(x => coreProxyHander.set(target, property, x));
        }
        else {
            willCoreModules.execptionHander.handleExeception("Unsupported Assignment", `Views can only take element, URL and route assignments.`);
        }
        return true;
    }
}
function routerFunction(route, routeParameters) {
    let parameters = [];
    let parameterString = "";
    if (routeParameters && typeof routeParameters === "object") {
        for (var key in routeParameters) {
            parameters.push(`${key}=${encodeURIComponent(routeParameters[key])}`);
        }
        if (parameters.length > 0) {
            parameterString = "?" + parameters.join("&");
        }
    }
    window.location.hash = route + parameterString;
    willCoreModules.router.init();
}

var WillCoreInstance = {
    router: willCoreModules.router,
    _init: false,
    willCore: new Proxy(routerFunction, coreProxyHander),
};

willCoreModules.router.setCoreProxy(WillCoreInstance.willCore);

var mainInstance = WillCoreInstance.willCore;
window.willCore = mainInstance;
export {
    mainInstance as willCore
};