/**
 * Collection traps are validation methods on collections that return true or false.
 * If a trap returns false, a collection will not fire a update event.
 * 
 * @typedef {import("./add.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var targets = async (view, configuration) => {
    view.categoryRequestResult = (target, property, value) => {
        view.formData = { name: value.name, description : value.desciption, picture: value.image};
    }
};

export { targets };

