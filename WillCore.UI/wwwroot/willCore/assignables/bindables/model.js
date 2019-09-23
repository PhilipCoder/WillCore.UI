import { bindable } from "../../binding/bindable.js";
import { assignable } from "../../binding/assignable.js";

class model extends bindable {
    constructor(viewManager) {
        super({ function: 1 }, viewManager);
        super.topInstance = this;
        this.bindingMethod;
        this.previousValue = null;
        this.targetValue = undefined;
    }
    setValues(values) {
        if (!this.element) return;
        try {
            this.bindingMethod = values.function[0];
            this.targetValue = this.viewManager.collectionManager.runBindingFunc(this.bindingMethod);
            this.updateDom();
            this.viewManager.collectionManager.listen(this, this.targetValue);
            this.viewManager.collectionManager.runBindingFunc(this.bindingMethod);
            this.viewManager.collectionManager.stopListen();
        } catch (e) {
            this.viewManager.collectionManager.registerUnbinded();
        }
    }
    updateDom() {
        var targetValue = this.bindingMethod();
        if (!this.element || typeof targetValue == "undefined" || this.element.type == "file") return;
        if (this.previousValue === targetValue) return;
        if (this.element.tagName === "IMG") {
            var imageBase64 = typeof targetValue === "object" ? this.getBase64(targetValue) : targetValue;
            this.element.src = "data:image/png;base64," + imageBase64;
            return;
        }
        this.element.value = targetValue;
    }
    setValueProps(receiver, property) {
        if (!this.element || typeof this.targetValue == "undefined") return;
        var that = this;
        this.element.oninput = function (event) {
            var value = "";
            if (that.element.type == "checkbox" || that.element.type == "radio") {
                value = that.element.checked;
            } else if (that.element.type == "file") {
                that.loadFileBytes(receiver, property);
                return true;
            }
            else if ("value" in that.element) {
                value = that.element.value;
            } else {
                throw "This type of model binding is not supported (yet)";
            }
            receiver[property] = value;
            return true;
        };
    }

    loadFileBytes(receiver, property) {
        var reader = new FileReader();
        reader.onload = function () {
            var arrayBuffer = new Uint8Array(this.result);
            receiver[property] = Array.from(arrayBuffer);
        };
        reader.readAsArrayBuffer(this.element.files[0]);
    }

    getBase64(bytes) {
        var binary = '';
        var len = bytes.length;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
};

assignable.registerBindable("model", model);

export { model };