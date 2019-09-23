import { source } from "../../willCore/WillCore.js";
/**
 * Builds up the collections that are used by the view
 * @param {any} view
 */
var collections = async (view, configuration) => {
    view.userDetailCollection = { email: "", password: "", termsAndConditions: false };
    view.status = { countDown: configuration.countDownSeconds };

    //view.status = () => console.log("hitting source");
    //view.status = () => console.log("hitting source X");
    //view.status = (target, property) => ({
    //    countDown: () => { console.log(property); console.log(target); },
    //    value: () => { console.log(property); console.log(target); }
    //});
    //view._status();
    //view.status.countDown = 9;
    //view.status = { countDown: configuration.countDownSeconds };
    //view.status.countDown = 19;
};

export { collections };