import { willCore } from "/willCore/WillCore.js";
/**
 * Logic module 
 * 
 * @typedef {import("./view.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var logic = (view, configuration) =>
    ({
        navigateOnSuccess: () => {
            for (let i = 1; i < configuration.countDownSeconds + 1; i++) {
                window.setTimeout(() => {
                    view.status.countDown = configuration.countDownSeconds - i;
                    if (configuration.countDownSeconds - i === 0) willCore(configuration.landingPage);
                }, 1000 * i)
            }
        }
    });

export { logic };