let view = async (model, ui, requests) => {
    console.log("home hit");
    model.myData = {
        name: "John",
        surname: "Doe",
        genders: { Male: "male", Female: "female" },
        gender: "",
        list: [{ value: "ItemA" }, { value: "ItemB" }, { value: "ItemC" }]
    };
    model.loopData = {
        items: [
            { title: "First", description: "One" },
            { title: "Second", description: "Two" },
            { title: "Third", description: "Three" },
            { title: "Fourth", description: "Four" },
        ]
    };

    model.$itemRow.repeat = () => model.loopData.items;
    //Initiate the repeat binding
    model.$itemRow.repeat = (elements, rowIndex) => {
        elements.$itemRowTitle.bind = () => model.loopData.items[rowIndex].title;
        elements.$itemRowDescription.bind = () => model.loopData.items[rowIndex].description;
    };

    console.log(await requests.product.getData.get({ resultCount: 8, value: "Hello world" }));
    console.log(await requests.product.postData.post({ resultCount: 8, value: "Hello world" }));

    model.$output.bind = () => model.myData.name;
    model.$input.model = () => model.myData.name;
    model.$button.onclick.event = () => {
        model.myData.name = model.myData.name + model.myData.surname;
        model.myData.list[1] = { value: "changed" };
    }
    model.$greaterShown.show = () => model.myData.name.length > 10;
    model.$greaterHidden.hide = () => model.myData.name.length > 10;
    model.$greaterDisabled.disabled = () => model.myData.name.length > 10;
    model.$dropdown.options = () => model.myData.genders;
    model.$dropdown.model = () => model.myData.gender;
    model.$dropdown.backgroundColor.style = () => model.myData.gender === "male" ? "lightblue" : model.myData.gender === "female" ? "pink" : "white";
    model.$repeatMe.repeat = () => model.myData.list;
    model.$repeatMe.repeat = (elements, valueIndex) => {
        elements.$repeatMe.bind = () => model.myData.list[valueIndex].value;
    };
    model.$partialDiv.view = "/zView/partial";
    model.$partialDiv.view = (clientModel) => {
        window.setTimeout(() => {
            clientModel.data.value = "5 Seconds Passed.";
        }, 5000);
    };
    model.$goTo.onclick.event = () => {
        model.location.navigate("/zView/about", { name: 'John', surname: 'Doe' });
    };

    model.watch = () => model.myData.name;
    model.watch = () => {
        console.log(model.myData.name);
    };
    model.$input.invalid.class = () => model.myData.name.length === 0;
    model.$reassignBtn.onclick.event = () =>{
        model.loopData.items = [
            { title: "FirstA", description: "One" },
            { title: "SecondB", description: new Date().getTime() },
            { title: "ThirdD", description: "Three" },
            { title: "FourthV", description: "Four" },
            { title: "Five", description: "5" },

        ];
    };
    //  await model.$customElement.viewModel;
    //model.$customElement.viewModel.data.clickCount = 100;
};

let layout = "/zTestLayouts/layout"

export { view, layout };