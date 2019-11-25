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

    async handleFile(request, response) {
        return new Promise(async (resolve, reject) => {
            try {
                if (request.url === "/" || request.url === "/codegen") request.url = request.url === "/codegen" ? "/codegen/index.html" : "/index.html";
                if (!this.checkRequestFileExtension(request, response)) resolve(false);
                if (!this.createFileServer(request, response, this)) resolve(false);
                await this.serverFile(request, response, this);
                resolve(true);
            } catch (e) {
                console.log("====================================STATIC FILE SERVER ERROR==================================");
                console.log(e);
                console.log("===============================================================================================");
            }
        });
    }

    checkRequestFileExtension(request, response) {
        var fileExtenstion = path.extname(request.url);
        if (!fileExtenstion) {
            response.end("File not found.");
            return false;
        }
        return true;
    }

    createFileServer(request, response, that) {
        if (that.getFileExcluded(request.url)) {
            response.writeHead("401");
            response.end("File not available for access.");
            return false;
        }
        return true;
    }

    serverFile(request, response, that) {
        return new Promise(async (resolve, reject) => {
            var fileURL = that.getFileLocation(request.url);
            var result = await that.serveFile(fileURL, that);
            response.writeHead(that.responseCode, { 'Content-Type': that.mimeType });
            response.end(result);
            resolve();
        });
    }

    serveFile(filePath, that) {
        return new Promise(async (resolve, reject) => {
            that.calculateMimeType(filePath, that);
            if (!that.mimeType) {
                that.responseCode = 401;
                resolve();
            }
            filePath = that.getFilePath(filePath);
            if ((await fileHelper.exists(filePath)) === false) {
                that.responseCode = 404;
                resolve();
            }
            let results = await fileHelper.read(filePath);
            resolve(results);
        });
    }

    calculateMimeType(filePath, that) {
        that.fileExtenstion = path.extname(filePath);
        that.mimeType = config.staticFiles.mimeTypes[that.fileExtenstion];
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