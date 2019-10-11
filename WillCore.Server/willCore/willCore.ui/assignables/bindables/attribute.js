var attribute = {
    getFactoryInstance: () => {
        class attribute extends willCoreModules.bindable {
            constructor(viewManager) {
                super({ function: 1, string: 1 }, viewManager);
                super.topInstance = this;
                this.bindingMethod;
            }
            setValues(values) {
                if (!this.element) return;
                try {
                    this.bindingMethod = values.function[0];
                    this.targetAttribute = values.string[0];
                    this.viewManager.collectionManager.listen(this, this);
                    this.updateDom();
                    this.viewManager.collectionManager.stopListen();
                } catch (e) {
                    this.viewManager.collectionManager.registerUnbinded();
                }
            }
            updateDom() {
                var targetValue = this.bindingMethod();
                if (!this.element || typeof targetValue == "undefined") return;
                var currentAttribute = this.element.getAttribute(this.targetAttribute);
                currentAttribute = currentAttribute == undefined || currentAttribute == null ? "" : currentAttribute;
                if (typeof (targetValue) == "function") {
                    targetValue = targetValue();
                }
                if (typeof (targetValue) == "object") {
                    for (var key in targetValue) {
                        var propValue = targetValue[key];
                        if (typeof (propValue) == "function") {
                            propValue = propValue();
                        }
                        if (typeof (propValue) == "boolean") {
                            var parts = currentAttribute.split(" ").map(x => x.trim()).filter(x => x !== "" && x !== key);
                            if (propValue) {
                                parts.push(key);
                            }
                            currentAttribute = parts.join(" ");
                        } else {
                            var parts = currentAttribute.split(";").filter(x => x && x.trim() !== "");
                            parts = parts.map(x => { var coreValues = x.split(":"); return [coreValues[0].trim(), coreValues[1].trim()] }).filter(x => x[0] !== key);
                            parts.push([key, propValue]);
                            currentAttribute = parts.map(x => x.join(":")).join(";");
                        }

                    }
                } else if (typeof (targetValue) == "string") {
                    currentAttribute = targetValue;
                }
                if (typeof (targetValue) == "boolean") {
                    if (targetValue) {
                        this.element.setAttribute(this.targetAttribute, "");
                    } else {
                        this.element.removeAttribute(this.targetAttribute, currentAttribute);
                    }
                } else {
                    this.element.setAttribute(this.targetAttribute, currentAttribute);
                }
                return targetValue;
            }
        };
        return attribute;
    }
}
export { attribute };

