/**
 * Binds the HTML elements to the collections
 * @param {any} view
 */
var bindings = async (view) => {
    view.$categoryCard.repeat = (gridArray = view.categories) => gridArray;
    view.$categoryCard.repeat((elements, row) => {
        elements.$image.model = () => row.image;
        elements.$title.innerHTML = () => row.name;
        elements.$desctiption.innerHTML = () => row.desciption;
    });
};

export { bindings };