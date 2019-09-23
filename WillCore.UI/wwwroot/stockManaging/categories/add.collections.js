/**
 * Builds up the collections that are used by the view
 * @param {any} view
 */
var collections = async (view, configuration) => {
    view.formData = { name: "", description: "", picture: null };
    view.categoryRequestResult = {};
};

export { collections };