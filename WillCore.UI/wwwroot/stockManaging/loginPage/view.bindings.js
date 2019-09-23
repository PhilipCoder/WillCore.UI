/**
 * Binds the HTML elements to the collections
 * @param {any} view
 */
var bindings = async (view) => {
    //model bindings
    view.$termsAndConditions.model = () => view.userDetailCollection.termsAndConditions;
    view.$emailInput.model = () => view.userDetailCollection.email;
    view.$passwordInput.model = () => view.userDetailCollection.password;
    //validation
    view.$emailInput.attribute.class = () => ({ "is-invalid": () => view.userDetailCollection.email.indexOf("@") < 1 });
    view.$passwordInput.attribute.class = () => ({ "is-invalid": () => view.userDetailCollection.password.length < 4 });
    view.$submitButton.attribute.disabled =
        (password = view.userDetailCollection.password, email = view.userDetailCollection.email, termsAndConditions = view.userDetailCollection.termsAndConditions) =>
            password.length < 4 || email.indexOf("@") < 1 || !termsAndConditions;
    //login result
    view.$loginFailed.attribute.style = () => ({"display": x => view.validationResult.success == false ? "block" : "none"});
    view.$loginSuccess.attribute.style = () => ({ "display": x => view.validationResult.success == true ? "block" : "none" });
    //count down
    view.$navigationCountDown.innerHTML = () => `Navigating in (${view.status.countDown})`;
};

export { bindings };