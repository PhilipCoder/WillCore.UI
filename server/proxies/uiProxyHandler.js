const assignableProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler.js");


class uiProxyHandler extends assignableProxyHandler {
    constructor(assignable) {
        super(assignable);
        this.getTraps.unshift(this.addClientAssignable);
        this.getTraps.unshift(this.openBrowser);
    }

    addClientAssignable(target, property, proxy) {
        if (property === "addClientAssignable") {
            return { value: proxy._assignable.addClientAssignable, status: true }
        }
        return { status: false };
    }

    openBrowser(target, property, proxy) {
        if (property === "open") {
            const runFunc = () => {
                let assignable = proxy._assignable.parentProxy._assignable;
                var url = `${assignable.serverType}://localhost:${assignable.serverInfo.port}`;
                var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
                require('child_process').exec(start + ' ' + url);
            };
            return { value: runFunc, status: true }
        }
        return { status: false };
    }
}

module.exports = uiProxyHandler;