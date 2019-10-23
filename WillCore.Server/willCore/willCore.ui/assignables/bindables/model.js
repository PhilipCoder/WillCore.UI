let model = {
    getFactoryInstance: () => {
        class model extends willCoreModules.bindable {
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
                let targetValue = this.bindingMethod();
                if (!this.element || typeof targetValue == "undefined" || this.element.type == "file") return;
                if (this.previousValue === targetValue) return;
                if (this.element.tagName === "IMG") {
                    let imageBase64 = typeof targetValue === "object" ? this.getBase64(targetValue) : targetValue;
                    this.element.src = "data:image/png;base64," + imageBase64;
                } else if (this.element.type == "checkbox" || this.element.type == "radio") {
                    this.element.checked = !!targetValue;
                } else {
                    this.element.value = targetValue;
                }
            }
            setValueProps(receiver, property) {
                if (!this.element || typeof this.targetValue == "undefined") return;
                let that = this;
                if (that.element.type == "checkbox" || that.element.type == "radio") {
                    this.element.onclick = function (event) {
                        receiver[property] = that.element.checked;
                        return true;
                    };
                } else if (that.element.type == "file")
                    this.element.onchange = function (event) {
                        let value = "";
                        that.loadFileBytes(receiver, property);
                        return true;
                    };
                else {
                    this.element.oninput = function (event) {
                        let value = "";
                        if ("value" in that.element) {
                            value = that.element.value;
                        } else {
                            throw "This type of model binding is not supported (yet)";
                        }
                        receiver[property] = value;
                        return true;
                    };
                }
            }

            loadFileBytes(receiver, property) {
                let reader = new FileReader();
                reader.onload = function () {
                    let arrayBuffer = new Uint8Array(this.result);
                    receiver[property] = Array.from(arrayBuffer.values());
                };
                reader.readAsArrayBuffer(this.element.files[0]);
            }

            getBase64(bytes) {
                let binary = '';
                let len = bytes.length;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            }
        };
        return model;
    }
}
export { model };