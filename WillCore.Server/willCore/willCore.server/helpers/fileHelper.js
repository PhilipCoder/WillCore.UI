const fs = require("fs");
class fileHelper {
    constructor() {
        this.debugMode = false;
        this.log("Instantiating file service...");
        this.log("Current open files: 0");
        this.openFileCount = 0;
    }

    readFile(filePath) {
        this.log(`Starting: reading file: ${filePath}`);
        this.openFileCount++;
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, contents)=> {
                this.openFileCount--;
                if (err) {
                    this.log(`Error: reading file: ${filePath}. Error: ${err}`);
                } else {
                    this.log(`Done: reading file: ${filePath}`);
                    this.log(`Current open files: ${this.openFileCount}`);
                }
                resolve(contents);
            });
        });
    }

    read(filePath) {
        this.log(`Starting: reading file: ${filePath}`);
        this.openFileCount++;
        return new Promise((resolve, reject) => {
            fs.readFile(filePath,  (err, contents) => {
                this.openFileCount--;
                if (err) {
                    this.log(`Error: reading file: ${filePath}. Error: ${err}`);
                } else {
                    this.log(`Done: reading file: ${filePath}`);
                    this.log(`Current open files: ${this.openFileCount}`);
                }
                resolve(contents);
            });
        });
    }

    writeFile(filePath, content) {
        this.log(`Starting: writing file: ${filePath}`);
        this.openFileCount++;
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, 'utf8', (err)=> {
                this.openFileCount--;
                if (err) {
                    this.log(`Error: reading file: ${filePath}. Error: ${err}`);
                    resolve(false);
                } else {
                    this.log(`Done: reading file: ${filePath}`);
                    this.log(`Current open files: ${this.openFileCount}`);
                    resolve(true);
                }
            });
        });
    }

    exists(filePath) {
        this.log(`Starting: checking file: ${filePath}`);
        this.openFileCount++;
        return new Promise((resolve, reject) => {
            fs.access(filePath, fs.F_OK, (err) => {
                this.openFileCount--;
                this.log(`Done: checking file: ${filePath}`);
                if (err) {
                    console.error(err)
                    resolve(false);
                }
                resolve(true);
            })
        });
    }

    log(msg) {
        if (this.debugMode) {
            console.log(msg);
        }
    }
}

global.fileHelper = new fileHelper();

module.exports = global.fileHelper;