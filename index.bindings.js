let view = async (model, ui, requests, events) => {
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
};


export { view };