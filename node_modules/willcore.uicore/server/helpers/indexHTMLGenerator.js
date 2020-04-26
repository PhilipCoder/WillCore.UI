let generatedHTML = null;

let indexHTMLGenerator = function(scriptRegistry, styleRegistry){
    let styleIncludes = styleRegistry.modules.map(entry => `<link rel="${entry.type}" href="${entry.url}" type="text/css" />`).join("\n");
    let scriptIncludes = scriptRegistry.modules.map(entry => `<script defer type="${entry.type}" src="${entry.url}"></script>`).join("\n");
    generatedHTML = generatedHTML || `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    ${styleIncludes}
    ${scriptIncludes}
  </head>
  <body>
  </body>
</html>`;
    return generatedHTML;
};

module.exports = indexHTMLGenerator;