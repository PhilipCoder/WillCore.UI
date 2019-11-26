class editorModuleNav extends HTMLElement {
    constructor() {
        super();
        this.view = null;
        //this.shadowMode = true;
        willCore["editor-module-nav"].load(this);
    }
    main(view) {
        view.values = { label: "lolman", items: [], extenstion: "", currentLink: null, file: null };
    }

    set label(value) {
        this.view.values.label = value;
    }

    set file(value) {
        this.view.values.file = value;
        var extention = value.substring(value.lastIndexOf("."));
        this.view.server.editorModuleNav.getViewNavItems({ extention: extention }).then((result) => {
            this.view.values.items = result;
            let defaultRow = result.filter(x => x.default)[0];
            this.view.values.currentLink = defaultRow.label;
            if (this._changeEvent) {
                this._changeEvent(this.view.values.file.replace(this.view.values.extenstion, defaultRow.lastPart));
            }
        });
        this.view.values.extenstion = extention;
    }

    set changeEvent(value) {
        this._changeEvent = value;
    }

    set currentLink(value) {
        this.view.values.currentLink = value;
    }

    connectedCallback() {
        this.view.$modulesLabel.innerHTML = () => this.view.values.label;
        this.view.$moduleItem.repeat = () => this.view.values.items;
        this.view.$moduleItem.repeat((elements, row, index) => {
            elements.$moduleName.innerHTML = () => row.label;
            elements.$moduleIcon.attribute.class = () => row.icon;
            elements.$moduleItem.attribute.class = () => ({ activeLink: this.view.values.currentLink === row.label });
            elements.$moduleItem.event.onclick = () => {
                this.view.values.currentLink = row.label;
                if (this._changeEvent) {
                    this._changeEvent(this.view.values.file.replace(this.view.values.extenstion, row.lastPart));
                }
            };
        });
    }
}

export { editorModuleNav };