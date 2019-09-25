var view = async (view) => {
    //Define a collection:
    view.greeting = { message: "Hello World" };
    //Binds the heading's inner HTML to the property on the collection:
    view.$greetingOutput.innerHTML = () => view.greeting.message;
};

export { view };