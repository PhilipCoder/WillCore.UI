function loadHTML(url, view) {
    var promise = new Promise((resolve, reject) => {
        var headers = new Headers();
        headers.append('Content-Type', 'text/html');
        fetch(url, {
            mode: 'cors',
            method: 'get',
            headers: headers
        }).then(function (response) {
            response.text().then(function (text) {
                resolve(new willCoreModules.idManager(view.viewManager).getProcessedIdHTML(text));
            });
        })
    });
    return promise;
}

export { loadHTML };