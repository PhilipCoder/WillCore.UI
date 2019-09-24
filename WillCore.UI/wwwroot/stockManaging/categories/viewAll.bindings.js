import { willCore, partial,request } from "/willCore/WillCore.js";
/**
 * Binds the HTML elements to the collections
 * @param {any} view
 */
var bindings = async (view) => {
    view.$categoryCard.repeat = (gridArray = view.categories) => gridArray;
    view.$modal = [partial, "/stockManaging/partials/confirm.html", "/stockManaging/partials/confirm.js", {
        info: { heading: "Please Confirm", message: "Are you sure you want to delete the category?", show: false }
    }];
    view.$modal.aggree = async () => {
        view.$modal.aggree = [request, "DELETE", window.location.origin + `/api/Category/${view.$modal.info.id}`, {}, {}];
        await view.$modal.aggree;
        view.categories = [request, "GET", window.location.origin + "/api/Category", {}, {}];
    };

    view.$categoryCard.repeat((elements, row) => {
        elements.$image.model = () => row.image;
        elements.$title.innerHTML = () => row.name;
        elements.$desctiption.innerHTML = () => row.desciption;
        elements.$editCategory.attribute.href = () => `#/addcategory?id=${row.id}`;
        elements.$deleteCategory.event.onclick = () => {
            view.$modal.info.show = true;
            view.$modal.info.id = row.id;
        };
    });
};

export { bindings };