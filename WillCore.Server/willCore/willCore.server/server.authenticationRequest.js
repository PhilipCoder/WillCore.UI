var session = require('./server.session.js');

class authenticationRequest {
    checkAuthentication(request, response) {
        var parts = request.url.split("/").filter(x => x && x.length > 0);
        if (parts.length != 1 && parts[0] != "authentication") return false;
        var result = new session(request, response).getCookieObject();
        result = result || { authenticated: false };
        response.writeHead(200, { 'Content-Type': "application/json" });
        response.end(JSON.stringify(result));
        return true;
    }
}

module.exports = authenticationRequest;