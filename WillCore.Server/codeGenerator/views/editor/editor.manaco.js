var languages = {
    ".js": "javascript",
    ".html": "html",
    ".css": "css",
    ".json": "json"
};

window.editor = null;
var currentHTMLFile = null;
async function createDependencyProposals() {
    return new Promise(async (resolve, reject) => {
        var result = await fetch(currentHTMLFile, {
            method: "GET",
            mode: 'cors',
        });
        var html = await result.text();
        var tmpElement = document.createElement("div");
        tmpElement.innerHTML = html;
        var allElements = tmpElement.getElementsByTagName("*");
        var nodesWithIds = Array.from(allElements).filter(x => x.id);
        resolve(nodesWithIds.map(x =>
            ({
                label: `$${x.id}`,
                kind: monaco.languages.CompletionItemKind.Field,
                documentation: `HTML element of type ${x.tagName}.`,
                insertText: `$${x.id}`
            })
        )
        );
    });
}

monaco.languages.registerCompletionItemProvider('javascript', {
    triggerCharacters: ['.', '$'],
    provideCompletionItems: async function (model, position) {
        var textUntilPosition = model.getValueInRange({ startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
        console.log(textUntilPosition);
        var match = textUntilPosition.match(/vie\w.\$/);
        console.log(match);
        var suggestions = match ? await createDependencyProposals() : [];

        return {
            suggestions: suggestions
        };
    }
});

async function loadFileIntoEditor(currentFile, view) {
    currentHTMLFile = currentFile.substring(currentFile.indexOf("/")+1);
    currentHTMLFile = currentHTMLFile.substring(0, currentHTMLFile.indexOf(".")) + ".html";
    var extension = currentFile.substring(currentFile.lastIndexOf("."));
    var mode = languages[extension] ? languages[extension] : "javascript";
    var result = await willCoreModules.server.runRequest("editor/readFile", { url: currentFile });
    if (!window.editor) {
        require(['vs/editor/editor.main'], function () {
            window.editor = monaco.editor.create(document.getElementById(view.$editor.id), {
                value: result,
                theme: 'vs-dark',
                language: mode
            });
            window.editor.layout();
        });
    } else {
        window.editor.setModel(monaco.editor.createModel(result, mode));
    }
};

export { loadFileIntoEditor };