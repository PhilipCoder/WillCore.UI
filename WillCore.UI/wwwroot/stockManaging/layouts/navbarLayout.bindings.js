/**
 * Binds the HTML elements to the collections
 * @param {any} view
 */
var bindings = async (view) => {
    view.$allCategories.attribute.class = () => ({ active: view.route.url === "/categories" });
    view.$addCategory.attribute.class = () => ({ active: view.route.url === "/addcategory" });
    view.$info.attribute.class = () => ({ active: view.route.url === "/info" });

    view.route.trap = (target, property, value) => {
        console.log(value);
        return true;
    };
};

export { bindings };