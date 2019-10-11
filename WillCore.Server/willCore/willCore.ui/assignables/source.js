var source = {
    getFactoryInstance: () => {
        class source extends willCoreModules.assignable {
            constructor() {
                super({ function: 2 });
                this.target = null;
                this.source = null;
                this.originalValue = null;
                super.topInstance = this;
                this.deleteFromProxy = false;
                this.baseObj = null;
            }

            setValues(values) {
                var sourceFunc = values.function[0];
                var mapperFunc = values.function[1];
                this.originalValue._proxyTarget._sources = this.target[this.source]._sources || [];
                this.originalValue._proxyTarget._sources.push({ sourceFunc: sourceFunc, mapperFunc: mapperFunc });
                var that = this;
                this.originalValue.source = function () {
                    let target = that.target;
                    let property = that.source;
                    console.log("wow " + target);
                };

                this.target[this.source] = this.originalValue;
                console.log(this.originalValue._proxyTarget);

            }

            setTarget(target, source) {
                this.target = target;
                this.source = source;
                console.log(target);
                console.log(source);
            }

            static assignAbleToNonElement() {
                return true;
            }

            static loadTarget(target, source, instance, baseObj) {
                instance.originalValue = target[source];
            }
        };
        return source;
    }
}
export { source };