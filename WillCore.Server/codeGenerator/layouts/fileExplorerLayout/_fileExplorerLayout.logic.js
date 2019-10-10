/**
 * Logic module 
 * 
 * @typedef {import("./_fileExplorerLayout.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var logic = (view, configuration) => ({
    promptViewName: async () => {
        var result = await view.$inputModal.logic.show("Create New View",  "Enter The Unique Name Of The View", "Enter view name ( without file extensions )", "");
        alert(result);
    },
    promptLayoutName: async () => {
        var result = await view.$inputModal.logic.show("Create New View Layout", "Enter The Unique Name Of The Layout", "Enter layout name ( without file extensions )", "");
        alert(result);
    },
    promptFolderName: async () => {
        var result = await view.$inputModal.logic.show("Create New Folder", "Enter The Unique Name Of The Folder", "Enter folder name", "");
        alert(result);

    }
});

export { logic };