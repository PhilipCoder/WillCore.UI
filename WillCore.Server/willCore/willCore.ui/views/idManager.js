class idManager {
    constructor(viewManager) {
        this.viewName = viewManager ? viewManager.name : null;
    }
    getElement(id) {
        return this.getElementExistingId(this.get(id));
    }
    getElementExistingId(id) {
        return document.getElementById(id);
    }
    get(id) {
        return this.viewName ? `${this.viewName}.${id}` : id;
    }
    getProcessedIdHTML(html) {
        let that = this;
        let newElement = document.createElement("div");
        newElement.innerHTML = html;
        let allElements = newElement.querySelectorAll("*");
        let ids = {};
        allElements.forEach(elem => {
            if (elem.getAttribute("id")) {
                let id = that.get(elem.getAttribute("id"));
                elem.setAttribute("id", id);
                if (ids[id]) {
                    willCoreModules.execptionHander.handleExeception("Duplicate Element IDs Detected!", `The view ${that.viewName} has more than one element with ID ${id}.`);
                }
                ids[id] = true;
            }
        });

        return newElement.innerHTML;
    }
    removeElement(id) {
        let element = this.getElement(id);
        element.remove();
        return element;
    }
}

export { idManager };