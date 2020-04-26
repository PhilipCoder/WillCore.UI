let view = async (model) => {
    console.log("home hit");
    model.myData = { name: "John", surname: "Doe" };
    model.$output.bind = () => model.myData.name;
    model.$input.model = () => model.myData.name;
    model.$button.onclick.event = () => model.myData.name = model.myData.name + model.myData.surname;
};

let layout = "/zTestLayouts/layout"

export { view, layout };