var session = require('node-session');
var config = require('./config.json');

class authenticated {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    /**
     * Checks whether an user is authenticated.
     * */
    authenticated() {
        return !!this.request.get('data');
    };

    /**
     * Gets the session data.
     * */
    getData() {
        return this.request.get('data');
    };

    authentication(sessionData) {
        session = new NodeSession({
            secret: config.session.encryptionKey,
            lifetime: config.session.timout,
            expireOnClose: config.session.expireOnClose,
            driver: config.session.driver,
            cookie: config.session.cookie,
            domain: config.session.domain
        });
        session.startSession(this.request, this.response, () => { });
        this.request.session.put('data', sessionData);
    }
}



module.exports = authentication;