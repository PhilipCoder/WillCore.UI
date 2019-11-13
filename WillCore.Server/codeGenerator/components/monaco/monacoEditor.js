async function loadFile(editorInstance) {
    let fileContents = await willCoreModules.server.runRequest("monacoEditor/readFile", { url: editorInstance._file });
    let fileExtention = editorInstance._file.substring(editorInstance._file.lastIndexOf("."));
    editorInstance._language = editorInstance.languages[fileExtention] || "javascript";
    editorInstance.content = fileContents;
}

class monacoEditor extends HTMLElement {
    constructor() {
        super();
        this._file = null;
        this._language = "javascript";
        this._content = "";
        this.editor = null;
        this.theme = 'vs-dark';
        this.languages = {
            ".js": "javascript",
            ".html": "html",
            ".css": "css",
            ".json": "json"
        };
    }

    main() { }

    set language(value) {
        this._language = value;
        if (this.editor) {
            this.editor.setModel(monaco.editor.createModel(this._content, this._language));
        }
    }

    set file(value) {
        this._file = value;
        loadFile(this);
    }

    set content(value) {
        this._content = value;
        if (this.editor) {
            this.editor.setModel(monaco.editor.createModel(this._content, this._language));
        }
    }

     saveFile() {
         return new Promise(async(resolve, reject) => {
             var result = await willCoreModules.server.runRequest("monacoEditor/saveFile", { url: this._file, content: this.editor.getValue() });
             resolve(result);
        });
    }

    connectedCallback() {
        if (this.editor) {
            this.editor.dispose();
            this.editor = null;
        }
        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(document.getElementById(this.id), {
                value: this._content,
                theme: this.theme,
                language: this._language
            });
            this.editor.layout();
        });
    }

    disconnectedCallback() {
        if (this.editor) {
            this.editor.dispose();
            this.editor = null;
        }
    }
}

export { monacoEditor };