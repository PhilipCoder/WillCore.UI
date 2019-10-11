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
        var that = this;
        var newElement = document.createElement("div");
        newElement.innerHTML = html;
        var allElements = newElement.querySelectorAll("*");
        var ids = {};
        allElements.forEach(elem => {
            if (elem.getAttribute("id")) {
                var id = that.get(elem.getAttribute("id"));
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
        var element = this.getElement(id);
        element.remove();
        return element;
    }
}

export { idManager };