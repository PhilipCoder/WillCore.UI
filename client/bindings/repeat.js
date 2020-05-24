import { bindable } from "../binding/bindable.js";
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";

class component extends bindable {
    constructor() {
        super({ function: 2 }, 0);
    }

    static get noValues() {
        return elementProxy;
    }

    beforeBind() {
        this.originalChildren = this.clearIds(this.getCopyOfElements([this.element]));
    }


    updateDOM(values) {
        if (!values) return;
        if (!Array.isArray(values)) throw "Only arrays are allowed to be bound by the repeat bindable.";
        this.element.innerHTML = "";
        let valueIndex = 0;
        values.forEach((value) => {
            let model = this.getModel();
            if (typeof model.model !== "object") throw "Repeats can only bind to array of objects!";
            model.elements.forEach((element) => this.element.appendChild(element));
            this.bindedValues.function[1](model.model, valueIndex);
            valueIndex++;
        });
    }

    getModel() {
        let elements = this.getCopyOfElements(this.originalChildren);
        let model = {};
        elements.forEach((element) => {
            model[`$${element.id}`] = elementProxy.new(element);
        });
        return { model: model, elements: elements };
    }

    getCopyOfElements(nodes) {
        var result = [];
      //  var tmpDiv = document.createElement("div");
        for (var i = 0; i < nodes.length; i++) {
            tmpDiv.innerHTML = nodes[i].outerHTML;
            result.push(nodes[i].cloneNode(true));
        }
        return result;
    }

    clearIds(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (node.id && node.id.indexOf(".") > -1) {
                node.id = node.id.split(".")[1];
            }
            if (node.children) {
                this.clearIds(node.children);
            }
        }
        return nodes;
    }
}

export { component };