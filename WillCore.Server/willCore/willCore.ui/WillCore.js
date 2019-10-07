import { execptionHander } from "./helpers/exceptionHander.js";
import { assignable } from "./binding/assignable.js";
import { router } from "./views/router.js";
import { route } from "./assignables/route.js";
import { url } from "./assignables/url.js";
import { innerHTML } from "./assignables/bindables/innerHTML.js";
import { hide } from "./assignables/bindables/hide.js";
import { show } from "./assignables/bindables/show.js";
import { disabled } from "./assignables/bindables/disabled.js";
import { model } from "./assignables/bindables/model.js";
import { attribute } from "./assignables/bindables/attribute.js";
import { create } from "./assignables/bindables/create.js";
import { event } from "./assignables/bindables/event.js";
import { partial } from "./assignables/bindables/view.js";
import { repeat } from "./assignables/bindables/repeat.js";
import { viewFactory } from "./views/viewFactory.js";
import { request } from "./assignables/request.js";
import { viewManager } from "./views/viewManager.js";
import { idManager } from "./views/idManager.js";
import { layout } from "./assignables/bindables/layout.js";
import { layoutProxyFactory } from "./assignables/bindables/layoutProxyFactory.js";  
import { source } from "./assignables/source.js";
import { server } from "./assignables/server.js";
import { authentication } from "./helpers/authentication.js";


//=========WillCore======================================
var coreProxyHander = {
    get: function (target, property) {
        if (!target[property] && property.startsWith("$")) {
            var elementId = property.substring(1);
            var element = new idManager(null).getElement(elementId);
            return element || document.createElement("div");
        }
        else if (!target[property] || WillCoreInstance._init) {
            target[property] = viewFactory.getView(property, target);
        }
        return target[property];
    },

    set: function (target, property, value) {
        if (value && value.nodeType === 1) {
            value = value.element || value;
            if (!target[property]) {
                target[property] = viewFactory.getView(property, target);
            }
            if (target[property].viewManager.element) {
                execptionHander.handleExeception("Invalid Operation", `The DOM element for view is already assigned.`);
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
        else if (target[property] instanceof assignable) {
            target[property].assign(value);
        } else if (Array.isArray(value)) {
            value.forEach(x => coreProxyHander.set(target, property, x));
        }
        else {
            execptionHander.handleExeception("Unsupported Assignment", `Views can only take element, URL and route assignments.`);
        }
        return true;
    }
}
function routerFunction(route) {
    window.location.hash = route;
    router.init();
}

var WillCoreInstance = {
    router: router,
    _init:false,
    willCore: new Proxy(routerFunction, coreProxyHander),
};

router.setCoreProxy(WillCoreInstance.willCore);

var mainInstance = WillCoreInstance.willCore;
export { mainInstance as willCore, route, url, innerHTML, model, attribute, repeat, event, request, partial, layout, source, create, server, authentication, hide, disabled };