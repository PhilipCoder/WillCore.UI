var config = require('../../config.json');
var path = require('path');
var fs = require('fs');

var files = new Map();

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

    handleFile(request, response) {
        if (request.url === "/" || request.url === "/codegen") request.url = request.url === "/codegen" ? "/codegen/index.html"  : "/index.html";
        if (!this.checkRequestFileExtension(request, response)) return;
        if (!this.createFileServer(request, response)) return;
        this.serverFile(request, response);
        return true;
    }

    checkRequestFileExtension(request, response) {
        var fileExtenstion = path.extname(request.url);
        if (!fileExtenstion) {
            response.end("File not found.");
            return false;
        }
        return true;
    }

    createFileServer(request, response) {
        if (this.getFileExcluded(request.url)) {
            response.writeHead("401");
            response.end("File not available for access.");
            return false;
        }
        return true;
    }

    serverFile(request, response) {
        var fileURL = this.getFileLocation(request.url);
        var result = this.serveFile(fileURL);
        response.writeHead(this.responseCode, { 'Content-Type': this.mimeType });
        response.end(result);
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
        var cachedValue = files.get(filePath);
        if (!cachedValue) {
            cachedValue = fs.readFileSync(filePath);
            files.set(filePath, cachedValue);
        }
        return cachedValue;
    }

    //fs.access(filePath, fs.F_OK, (err) => {
    //    if (err) {
    //        console.error(err)
    //        return
    //    }

    //    response.writeHead(this.responseCode, { 'Content-Type': this.mimeType });

    //    const stream = fs.createReadStream(filePath)
    //    stream.pipe(response)
    //});

    calculateMimeType(filePath) {
        this.fileExtenstion = path.extname(filePath);
        this.mimeType = config.staticFiles.mimeTypes[this.fileExtenstion];
    }

    getFilePath(filePath) {
        return path.resolve(__dirname, `../../../../${filePath}`)
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