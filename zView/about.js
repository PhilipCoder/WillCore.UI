let view = async (model) => {
    console.log(model);
};

let layout = "/zTestLayouts/layout"

export {view, layout} ;//, access = async (willcore, server) => (await server.product.hasAccess.get()).hasAccess;
