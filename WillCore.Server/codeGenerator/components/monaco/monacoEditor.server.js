const fs = require('fs');
let pathUtil = require("../../serverLogic/pathUtil.js");
const path = require('path');

module.exports = (view) => {
    view.readFile = async (view) => {
        let url = path.resolve(pathUtil.getWWWRootDir(), "../", view.url);
        if (fs.existsSync(url)) {
            return fs.readFileSync(url, 'utf8');
        }
        return "";
    };
    view.saveFile = async (view) => {
        let url = path.resolve(pathUtil.getWWWRootDir(), "../", view.url);
        if (fs.existsSync(url)) {
            fs.writeFileSync(url, view.content);
        }
        return true;
    };
};