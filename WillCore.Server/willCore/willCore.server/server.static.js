var config = require('./config.json');
var path = require('path');
var fs = require('fs');

class staticFileServer {
    /**
    * Static file server. 
     * 
    * POST requests call server methods.
    * @param {import('http').IncomingMessage} request
    * @param {import('http').ServerResponse} response
    * */
    constructor() {
        this.mimeType = "text/plain";
        this.responseCode = 200;
    }

    serveFile(filePath) {
        this.calculateMimeType(filePath);
        if (!this.mimeType) {
            this.responseCode = 401;
            return;
        }
        filePath = this.getFilePath(filePath);
        if (!fs.existsSync(filePath)) {
            this.responseCode = 404;
            return;
        }
        return fs.readFileSync(filePath).toString();
    }

    calculateMimeType(filePath) {
        this.fileExtenstion = path.extname(filePath);
        this.mimeType = config.staticFiles.mimeTypes[this.fileExtenstion];
    }

    getFilePath(filePath) {
        return path.resolve(__dirname, `../../${filePath}`)
    }

    /**
    * Maps an URL to location on disk.
    * @param {string} url
    */
    getFileLocation(url) {
        url = url.toLowerCase();
        for (var i = 0; i < config.staticFiles.redirect.length; i++) {
            var redirect = config.staticFiles.redirect[i];
            let shouldDirect = url[redirect.match](redirect.value);
            shouldDirect = redirect.negative ? !shouldDirect : shouldDirect;
            if (shouldDirect) {
                url = url.replace(redirect.value, redirect.target);
                break;
            }
        }

        return url;
    }

    /**
     * Validates if a file is authorized to be served.
     * @param {string} url
     */
    getFileExcluded(url) {
        var isExcluded = false;
        config.staticFiles.fileExclutions.forEach(redirect => {
            let fieldExcluded = url[redirect.match](redirect.value);
            if (fieldExcluded) isExcluded = true;
        });
        return isExcluded;
    }

}

module.exports = staticFileServer;