var config = require('./config.json');

class requestDirector {
    /**
     * Directs a request to either static file serving or server collection sources.
     * GET requests serves static files.
     * POST requests call server methods.
     * @static
     * @param {import('http').IncomingMessage} request
     * @param {import('http').ServerResponse} response
     * */
    static directRequest(request, response) {
        if (request.method == "GET") {

        } else if (request.method == "POST") {

        } else {
            throw `Invalid request method ${request.method}`;
        }
    }

    /**
     * 
     * @param {string} url
     */
    static getFileLocation(url) {
        config.staticFiles.redirect.forEach(redirect => {
            let shouldDirect = url[redirect.match](redirect.value);
            shouldDirect = redirect.negative ? !shouldDirect : shouldDirect;
            url = shouldDirect ? url.replace(redirect.value, redirect.target) : url;
        });
        return url;
    }

    static getFileExcluded(url) {

    }
}

module.exports = requestDirector;