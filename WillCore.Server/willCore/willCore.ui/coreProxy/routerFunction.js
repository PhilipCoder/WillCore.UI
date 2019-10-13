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

export { routerFunction };