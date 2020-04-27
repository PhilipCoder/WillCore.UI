let view = (model) => {
    model.data = {value:"This is content from the partial page."};
    model.$output.bind = () => model.data.value;
};

export { view };