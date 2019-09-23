import { execptionHander } from "../helpers/exceptionHander.js";

var allBindables = {};

class assignable {
    constructor(assignmentConstraints) {
        this.assignmentConstraints = assignmentConstraints || { string: 2, object: 1 };
        this.assignedValues = {};
        this.assignmentCompletionEvent = null;
        this.topInstance = null;
    }

    assign(value) {
        var that = this;
        var valueType = null;
        if (typeof (value) == "object" && Array.isArray(value)) {
            valueType = "array";
        } else if (typeof (value) == "object") {
            valueType = "object";
        } else if (typeof (value) == "string") {
            valueType = "string";
        } else if (typeof (value) == "boolean") {
            valueType = "boolean";
        } else if (typeof (value) == "number") {
            valueType = "number";
        }
        else if (typeof (value) == "function") {
            valueType = "function";
        } else {
            execptionHander.handleExeception("Unsuppored Data Type", `Can't assign value ${value} to assignable.`);
        }
        if (valueType != null) {
            if (!this.assignmentConstraints[valueType] || (this.assignedValues[valueType] && this.assignedValues[valueType].length >= this.assignmentConstraints[valueType])) {
                execptionHander.handleExeception("Unsuppored Assignment", `The assignable ${this.topInstance.constructor.name} supports the following assignments: ${getErrorAssignmentValues()}.`);
            } else {
                this.assignedValues[valueType] = !this.assignedValues[valueType] ? [] : this.assignedValues[valueType];
                this.assignedValues[valueType].push(value);
                if (isAssignmentCompleted()) {
                    this.topInstance.setValues(this.assignedValues);
                    this.assignmentCompletionEvent(this.assignedValues);
                }
            }
        }
        
        function isAssignmentCompleted() {
            for (var key in that.assignmentConstraints) {
                if (!that.assignedValues[key] || that.assignedValues[key].length !== that.assignmentConstraints[key]) {
                    return false;
                }
            }
            return true;
        }

        function getErrorAssignmentValues() {
            var result = "";
            for (var key in that.assignmentConstraints) {
                result = result + `${key} : ${that.assignmentConstraints[key]}, `;
            }
            return result;
        }

    }

    static registerBindable(name, classType) {
        allBindables[name] = classType;
    }

    static getBindable(name) {
        return allBindables[name];
    }
}


export { assignable, allBindables };