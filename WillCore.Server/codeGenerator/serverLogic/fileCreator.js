const http = require('http');
const fs = require('fs');
const path = require('path');
const projectConfig = require('../config/projectConfig.json');

class fileCreator {
    constructor() {
        this.wwwRoot = path.resolve(__dirname, `../../wwwRoot`);
    }

    setBootstrap() {
        return this.downloadFile(projectConfig.bootstrapLink, path.resolve(this.wwwRoot,""))
    }

    downloadFile(url, dest) {
        return new Promise((resolve, reject) => {
            var file = fs.createWriteStream(dest);
            var request = http.get(url, function (response) {
                response.pipe(file);
                file.on('finish', function () {
                    file.close(resolve); 
                    resolve(true);
                });
            }).on('error', function (err) { 
                fs.unlink(dest); 
                resolve(false);
            });
        });
    }
}

module.exports = new fileCreator();