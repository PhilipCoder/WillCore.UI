/**
 * View module for the WillCore code generator's login page.
 * 
 * Author: Philip Schoeman
 * @param {any} view
 */
var view = async (view) => {
    //Collections
    view.loginData = { userName: "", password: "" };

    //Bindings
    view.$counter.innerHTML = () => view.serverSideCounter.counter;
    view.$userNameInput.model = () => view.loginData.userName;
    view.$passwordInput.model = () => view.loginData.password;
    view.$loginSuccess.show = () => view.loginData.success === true;
    view.$loginFailed.show = () => view.loginData.success === false;
    view.$submitButton.disabled = (password = view.loginData.password, username = view.loginData.userName) => password.length == 0 || username.length == 0;

    //Server Sources
    view.login = [willCoreModules.server, () => [view.loginData]];

    //Events
    view.$submitButton.event.onclick = () => view._login();

    //Targets
    view.loginData = (target, property, value) => {
        if (value && value.success) {
            willCore("/initProject");
        }
    }
};

export { view };