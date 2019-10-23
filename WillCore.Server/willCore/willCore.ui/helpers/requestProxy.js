
function PostRequest(url, method, parameterObj, headers) {
    headers['Content-Type'] = 'application/json';
    let body = null;
    let query = null;
    for (let key in parameterObj) {
        if (typeof parameterObj[key] === "object") {
            body = body || {};
            body = parameterObj[key];
        } else {
            query = query || {};
            query[key] = parameterObj[key];
        }
    }
    if (query) {
        url = new URL(url);
        url.search = new URLSearchParams(query);
    }
    return fetch(url, {
        method: method,
        mode: 'cors',
        body: JSON.stringify(body),
        headers: new Headers(headers)
    })
}

let requestProxyHandler = {
    get: function (target, property) {
        return function (view) {
            return PostRequest(`${window.location.origin}/${target.viewName}/${property}`, "PUT", { id: requestId, data: view }, {});
        };
    }
};

