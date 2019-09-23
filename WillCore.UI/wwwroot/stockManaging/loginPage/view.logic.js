import { willCore } from "../../willCore/WillCore.js";

var logic = (view, configuration) => {
    /**
     * Displays count down when login is success full
     * */
    return {
        navigateOnSuccess: () => {
            for (let i = 1; i < configuration.countDownSeconds + 1; i++) {
                window.setTimeout(() => {
                    view.status.countDown = configuration.countDownSeconds - i;
                    if (configuration.countDownSeconds - i === 0) willCore(configuration.landingPage);
                }, 1000 * i)
            }
        }
    }
};

export { logic };