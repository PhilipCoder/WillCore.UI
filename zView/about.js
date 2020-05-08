let viewFunction = async (model) => {
};

export let view = viewFunction, access = async (willcore, server) => (await server.product.hasAccess.get()).hasAccess;
