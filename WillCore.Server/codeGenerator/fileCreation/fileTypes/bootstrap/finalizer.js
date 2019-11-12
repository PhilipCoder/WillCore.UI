const fs = require('fs');
const path = require('path');

class finalizer {
    static finalize(wwwRootDir, config) {
        let indexFile = path.resolve(wwwRootDir, "index.html");
        if (fs.existsSync(indexFile)) {
            let fileContents = fs.readFileSync(indexFile, 'utf8');
            let codeTagIndex = fileContents.indexOf("<script ");
            if (codeTagIndex < 0) {
                return false;
            }
            let boostrapStyleLink = `<link href="${config.linkingPath}" rel="stylesheet" />\n    `;
            var output = fileContents.slice(0, codeTagIndex) + boostrapStyleLink + fileContents.slice(codeTagIndex);
            fs.writeFileSync(indexFile, output);
        }
    }
}

module.exports = finalizer;