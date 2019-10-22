const fileCreator = require("../../serverLogic/fileCreator.js");
const projectFile = require('../../serverLogic/projectFile.js');
const pathUtil = require('../../serverLogic/pathUtil.js');

module.exports = (view) => {
    view.createFolder = async (view) => {
        var folder = view.itemName;
        fileCreator.createFolder(folder);
        return true;
    };
    view.renameFile = async (view) => {
        var viewName = pathUtil.getViewName(view.filePath);
        if (projectFile.isViewLinked(viewName)) {
            return "Unlink view before renaming.";
        } else if (projectFile.viewExists(view.newName)) {
            return `View ${view.newName} already exists.`;
        } else {
            fileCreator.renameFile(view.filePath, view.newFileName);
        }
        return true;
    };
    view.deleteFile = async (view) => {
        var viewName = pathUtil.getViewName(view.filePath);
        if (projectFile.isViewLinked(viewName)) {
            return "Unlink view before deleting.";
        }  else {
            await fileCreator.deleteFile(view.filePath);
        }
        return true;
    };
};