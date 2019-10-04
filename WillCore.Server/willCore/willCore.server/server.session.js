var config = require('./config.json');
var byteConverter = require('./encryption/byteConverter.js');
var aesjs = require('./encryption/aes.js');

class authentication {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    /**
     * Checks whether an user is authenticated.
     * */
    authenticated() {
    };

    /**
     * Gets the session data.
     * */
    getData() {
    };

    authentication(sessionData) {
        var encryptoptor = new byteConverter();
        var encryptored = encryptoptor.encryptObject({ name: "DrPhil" });
        var decrypted = encryptoptor.decryptObject(encryptored);
        
    }
}



module.exports = authentication;