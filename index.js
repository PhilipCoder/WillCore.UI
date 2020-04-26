let view = async (model) => {
    console.log("home hit");
    model.myData = {
        name: "John",
        surname: "Doe",
        genders: { Male: "male", Female: "female" },
        gender: ""
    };
    model.$output.bind = () => model.myData.name;
    model.$input.model = () => model.myData.name;
    model.$button.onclick.event = () => model.myData.name = model.myData.name + model.myData.surname;
    model.$greaterShown.show = () => model.myData.name.length > 10;
    model.$greaterHidden.hide = () => model.myData.name.length > 10;
    model.$greaterDisabled.disabled = () => model.myData.name.length > 10;
    model.$dropdown.options = () => model.myData.genders;
    model.$dropdown.model = () => model.myData.gender;
    model.$dropdown.backgroundColor.style = () => model.myData.gender === "male" ? "lightblue" : model.myData.gender === "female" ? "pink" : "white";
};

let layout = "/zTestLayouts/layout"

export { view, layout };