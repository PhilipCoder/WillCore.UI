const fs = require('fs');
let pathUtil = require("../../serverLogic/pathUtil.js");
const path = require('path');

module.exports = (view) => {
    view.readFile = async (view) => {
        let url = path.resolve(pathUtil.getWWWRootDir(), "../", view.url);
        if (await fileHelper.exists(url)) {
            return await fileHelper.readFile(url);
        }
        return "";
    };
    view.saveFile = async (view) => {
        let url = path.resolve(pathUtil.getWWWRootDir(), "../", view.url);
        if (await fileHelper.exists(url)) {
            await fileHelper.writeFile(url, view.content);
        }
        return true;
    };
};