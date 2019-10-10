const fs = require('fs');
const path = require('path');

class fileExplorer {
    constructor(directory) {
        directory = path.resolve(__dirname, "..\\..\\", directory);
        this.directory = directory;
    }
    async getFiles() {
        return new Promise(async (resolve, reject) => {
            let files = await this.readFilesInDirectory(this.directory);
            var that = this;
            resolve(files.filter(file => path.extname(file) !== ".js" ).map(file => ({
                path: path.resolve(that.directory, file),
                fileName: path.basename(file),
                fileNameWithExtension:file,
                fileExtention: path.extname(file)
            })));
        });
    }

    readFilesInDirectory(directory) {
        return new Promise((resolve, reject) => {
            fs.readdir(directory, function (err, files) {
                if (err) {
                    reject();
                }
                resolve(files);
            });
        });
    }

}

module.exports = fileExplorer;