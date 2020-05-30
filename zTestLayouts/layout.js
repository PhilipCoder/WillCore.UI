let view = async (model, ui, requests, events) => {
    console.log(model);
    model.$currentPage.bind = () => model.location.name;
    events.navigate = (values) => {
        model.location.name = values.name;
    };
};

let containerId = "container";

export { view, containerId };