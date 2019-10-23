function GetRequest(url, method, parameters, headers) {
    headers['Content-Type'] = 'application/json';
    url = new URL(url);
    url.search = new URLSearchParams(parameters)
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: method,
            mode: 'cors',
            headers: new Headers(headers)
        }).then(async (response) => {
            response = await response.json();
            resolve(response);
        })
    });
}

async function authentication() {
    return GetRequest(`${window.location.origin}/authentication`,"GET", {}, {});
}

async function authenticated() {
    return new Promise(async (resolve, reject) => {
        let result = await GetRequest(`${window.location.origin}/authentication`, "GET", {}, {});
        resolve(result.authenticated);
    });
}

export { authentication, authenticated };