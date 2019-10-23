function routerFunction(route, routeParameters) {
    let parameters = [];
    let parameterString = "";
    if (routeParameters && typeof routeParameters === "object") {
        for (let key in routeParameters) {
            parameters.push(`${key}=${encodeURIComponent(routeParameters[key])}`);
        }
        if (parameters.length > 0) {
            parameterString = "?" + parameters.join("&");
        }
    }
    var forceUrl = false;
    let url = window.location.hash.slice(1) || "/";
    if (url.indexOf("?") > -1) {
        url = url.substring(url.indexOf("?"));
        forceUrl = url.indexOf("forceUrl=true") > -1;
    }
    if (!forceUrl) {
        window.location.hash = route + parameterString;
    }
    willCoreModules.router.init();
};
routerFunction.url = function (route, routeParameters) {
    let parameters = [];
    let parameterString = "";
    if (routeParameters && typeof routeParameters === "object") {
        for (let key in routeParameters) {
            parameters.push(`${key}=${encodeURIComponent(routeParameters[key])}`);
        }
        if (parameters.length > 0) {
            parameterString = "?" + parameters.join("&");
        }
    }
    return "#"+route+parameterString;
}

export { routerFunction };