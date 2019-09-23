/**
 * Binds the HTML elements to the collections
 * @param {any} view
 */
var bindings = async (view) => {
    view.$pictureInput.model = () => view.formData.picture;
    view.$previewImg.model = () => view.formData.picture;
    view.$nameInput.model = () => view.formData.name;
    view.$descriptionInput.model = () => view.formData.description;

    view.$nameInput.attribute.class = () => ({ "is-invalid": () => view.formData.name.length < 2 });
    view.$descriptionInput.attribute.class = () => ({ "is-invalid": () => view.formData.description.length < 4 });
    view.$fileField.attribute.class = () => ({ "is-invalid": () => !view.formData.picture });

    view.$submitButton.attribute.disabled =
        (name = view.formData.name, description = view.formData.description, picture = view.formData.picture) =>
            name.length < 2 || description.length < 4 || !picture;

    view.formData.trap =  (target, property, value) => {
            console.log(value);
            return true;
        };
};

export { bindings };