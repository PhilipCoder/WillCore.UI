
let moduleProxyTarget = {
    baseClasses: {},
    baseInhertants: {},
    allClasses: {},
    frameworkClasses:{ }
};

const moduleProxyHandler = {
    get: function (target, property) {
        return target[property];
    },
	/**
	 * @param {moduleProxyTarget} target
	 * @param {string} property
	 * @param {any} value
	 */
    set: function (target, property, value) {
		//Loop through all the registered baseClasses and see if the value inherits any of them
        for (let baseClassName in target.baseClasses) {
            if (value.prototype instanceof target.baseClasses[baseClassName]) {
                target.baseInhertants[baseClassName][property] = value;
            }
        }
        if (value.isBaseClass && !value.skipIndexing && property === value.isBaseClass() ) {
			//Registers base class
            target.baseClasses[property] = value;
            target.baseInhertants[property] = {};
			//See if any of the current registered classes inherits the base class and assign them.
            for (let className in target.allClasses) {
                if (target.allClasses[className].prototype && !target.allClasses[className].skipIndexing && value.prototype instanceof target.allClasses[className]) {
                    target.baseInhertants[property][className] = target.allClasses[className];
                }
            }
        }
        target.allClasses[property] = value;
        target[property] = value;
		//Assign the publicly accessable framework classes
        if (target.isFrameworkClass) {
            target.frameworkClasses[property] = value;
        }
        return true;
    }
};

/**
 * The proxy than handles the assignment of modules.
 * */
const moduleProxy = new Proxy(moduleProxyTarget, moduleProxyHandler);

export { moduleProxy };