import { moduleProxy } from "./moduleContainment/moduleProxy.js"
window.willCoreModules = moduleProxy;

import { assignable } from "./binding/assignable.js";
import { bindable } from "./binding/bindable.js";
import { collectionManager } from "./binding/CollectionManager.js";
import { execptionHander } from "./helpers/exceptionHander.js";
import { viewLoader } from "./views/viewLoader.js";
import { router } from "./views/router.js";
import { route } from "./assignables/route.js";
import { url } from "./assignables/url.js";
import { innerHTML } from "./assignables/bindables/innerHTML.js";
import { hide } from "./assignables/bindables/hide.js";
import { show } from "./assignables/bindables/show.js";
import { disabled } from "./assignables/bindables/disabled.js";
import { model } from "./assignables/bindables/model.js";
import { options } from "./assignables/bindables/options.js";
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
import { authentication, authenticated } from "./helpers/authentication.js";
import { bindingMangager } from "./binding/bindingManager.js";
import { loadHTML } from "./views/htmlLoader.js";
import { elementProxy } from "./binding/elementProxy.js";
import { guid } from "./helpers/guid.js";
import { proxyObject } from "./binding/proxyObject.js";
import { lazyImport } from "./helpers/lazyImport.js";
import { routerFunction } from "./coreProxy/routerFunction.js";
import { getDefaultElement } from "./coreProxy/get/getDefaultElement.js";
import { getDefaultView } from "./coreProxy/get/getDefaultView.js";
import { setDefaultView } from "./coreProxy/set/setDefaultView.js";
import { setDefaultPromise } from "./coreProxy/set/setDefaultPromise.js";
import { setLayoutInstance } from "./coreProxy/set/setLayoutInstance.js";
import { setDefaultAssignable } from "./coreProxy/set/setDefaultAssignable.js";


moduleProxy.routerFunction = routerFunction;
moduleProxy.getDefaultElement = getDefaultElement;
moduleProxy.getDefaultView = getDefaultView;
moduleProxy.setDefaultView = setDefaultView;
moduleProxy.setDefaultPromise = setDefaultPromise;
moduleProxy.setLayoutInstance = setLayoutInstance;
moduleProxy.setDefaultAssignable = setDefaultAssignable;

moduleProxy.assignable = assignable;
moduleProxy.bindable = bindable;
moduleProxy.collectionManager = collectionManager;
moduleProxy.execptionHander = execptionHander;
moduleProxy.viewLoader = viewLoader;
moduleProxy.elementProxy = elementProxy;
moduleProxy.route = route;
moduleProxy.url = url;
moduleProxy.router = router;
moduleProxy.innerHTML = innerHTML;
moduleProxy.hide = hide;
moduleProxy.options = options;
moduleProxy.show = show;
moduleProxy.disabled = disabled;
moduleProxy.model = model;
moduleProxy.attribute = attribute;
moduleProxy.create = create;
moduleProxy.event = event;
moduleProxy.partial = partial;
moduleProxy.repeat = repeat;
moduleProxy.viewFactory = viewFactory;
moduleProxy.request = request;
moduleProxy.viewManager = viewManager;
moduleProxy.idManager = idManager;
moduleProxy.layout = layout;
moduleProxy.layoutProxyFactory = layoutProxyFactory;
moduleProxy.source = source;
moduleProxy.server = server;
moduleProxy.authentication = authentication;
moduleProxy.authenticated = authenticated;
moduleProxy.bindingMangager = bindingMangager;
moduleProxy.loadHTML = loadHTML;
moduleProxy.guid = guid;
moduleProxy.proxyObject = proxyObject;
moduleProxy.lazyImport = lazyImport;

for (var key in moduleProxy.allClasses) {
    if (moduleProxy[key].getFactoryInstance) {
        moduleProxy[key] = moduleProxy[key].getFactoryInstance();
    }
}
export { moduleProxy };