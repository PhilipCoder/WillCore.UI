function GetRequest(url, method, parameters, headers) {
    headers['Content-Type'] = 'application/json';
    url = new URL(url);
    url.search = new URLSearchParams(parameters)
    return fetch(url, {
        method: method,
        mode: 'cors',
        headers: new Headers(headers)
    });
}

async function authentication() {
    return GetRequest(`${window.location.origin}/authentication`, {}, {});
}

export { authentication };