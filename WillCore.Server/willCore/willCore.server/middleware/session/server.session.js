var config = require('../../config.json');
var encryptor = require('./encryption/encryptor.js');
var aesjs = require('./encryption/aes.js');

/**
 * Authentication class that sets a user's session data.
 * 
 * Author: Philip Schoeman.
 * */
class authentication {
    /**
     * Creates a new instance of the authentication module.
     * @param {import('http').IncomingMessage} request
     * @param {import('http').ServerResponse} response
     */
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.encryptor = new encryptor();
    }

    /**
     * Encrypts and sets the data of the session cookie.
     * 
     * @param {object} sessionObj
     */
    authenticate(sessionObj) {
        if (!sessionObj.authenticated) {
            sessionObj.authenticated = true;
        }
        var encrypted = this.encryptor.encryptObject(sessionObj);
        var cookieString = `${config.session.cookie}=${encrypted}`;
        if (config.session.timeout) {
            cookieString += `; expires='${new Date(new Date().getTime() + config.session.timeout).toUTCString()}`;
        }
        if (config.session.sameSite) {
            cookieString += `; SameSite=${config.session.sameSite}`;
        }
        if (config.session.domain) {
            cookieString += `; Secure;Domain=${config.session.domain}`;
        }
        this.response.setHeader('Set-Cookie', cookieString );
    }

    /**
     * Checks whether an user is authenticated.
     * */
    authenticated() {
        var cookieObj = this.getCookieObject();
        return cookieObj && cookieObj.authenticated;
    };

    /**
     * Gets the Hex encrypted data of the session cookie.
     * @param {string} cookieName
     */
    getCookieHex(cookieName) {
        var sessionCookie = this.request.headers.cookie;
        if (sessionCookie && typeof sessionCookie === "string" && sessionCookie.length > 0) {
            let cookies = sessionCookie.split(";");
            for (let cookieIndex = 0; cookieIndex < cookies.length; cookieIndex++) {
                var cookieParts = cookies[cookieIndex].split("=");
                if (cookieParts.length== 2 && cookieParts[0].trim() === cookieName) {
                    return cookieParts[1].trim();
                }
            }
        }
        return null;
    }

    /**
     * Decrypts and returns the session data stored in the session cookie.
     * */
    getCookieObject() {
        var cookieHex = this.getCookieHex(config.session.cookie);
        if (cookieHex) {
            return this.encryptor.decryptObject(cookieHex);
        }
        return null;
    }
}

module.exports = authentication;