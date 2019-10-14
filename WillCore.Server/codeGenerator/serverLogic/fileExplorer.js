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
            let views = files.filter(x => x.indexOf(".bindings.js") > -1).map(x => x.substring(0, x.indexOf(".")+1));
            files = files.filter(file => views.filter(view => file.startsWith(view)).length === 0);
            views.forEach(x=>files.push(x+"view"));
            var that = this;
            resolve(files.map(file => ({
                path: path.resolve(that.directory, file),
                fileName: path.basename(file),
                fileNameWithExtension: file,
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