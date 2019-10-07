/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./login.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    view.$counter.innerHTML = () => view.serverSideCounter.counter;
    view.$userNameInput.model = () => view.loginData.userName;
    view.$passwordInput.model = () => view.loginData.password;
    view.$loginSuccess.show = () => view.loginData.success === true;
    view.$loginFailed.show = () => view.loginData.success === false;
    view.$submitButton.disabled = (password = view.loginData.password, username = view.loginData.userName) => password.length == 0 || username.length == 0;
};

export { bindings };