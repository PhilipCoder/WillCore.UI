const esprima = require("../../libraries/esprima/esprima_amd.js");
const codeGen = require("../../libraries/escodegen/escodegen.js");
const indexBindingFactory = require("./indexBindingExpressionFactory.js");
const indexParser = require("./indexParser.js");
const stringConstants = require("./expressionConstants.js");
const fs = require("fs");

/**
 * Class to add or remove bindings from the index.js file
 * 
 * Author: Philip Schoeman
 * */
class indexLinker {
    /**
     * Creates a new instance of the index linker
     * @param {string} filePath Path to the index.js file
     */
    constructor(filePath) {
        this.filePath = filePath;
    }

    /**
     * Adds an assignable to the index file.
     * 
     * @param {object} binding Expression tree for the binding
     */
    addBinding(binding) {
        try {
            let js = fs.readFileSync(this.filePath, 'utf8');
            try {
                let expressionTree = esprima.parseModule(js);
                let insertionIndexes = this.getIndexes(expressionTree);
                if (this.isComponent(binding)) {
                    expressionTree.body.splice(insertionIndexes.componentIndex, 0, binding);
                } else if (this.isLayout(binding)) {
                    expressionTree.body.splice(insertionIndexes.layoutIndex, 0, binding);
                } else if (this.isView(binding)) {
                    expressionTree.body.splice(insertionIndexes.viewIndex, 0, binding);
                } else {
                    throw "Unsupported binding added to index!";
                }
                var code = codeGen.generate(expressionTree);
                fs.writeFileSync(this.filePath, code);
                return true;
            } catch (e) {
                return { message: stringConstants.PARSING_ERROR, error: e };
            }
        } catch (e) {
            return { message: stringConstants.MAIN_ERROR, error: e };
        }
    }

    /**
     * Removes a binding by name from the index file.
     * 
     * @param {string} assignableName Name of the assignable, can be a view, layout or component
     */
    removeBinding(assignableName) {
        try {
            let js = fs.readFileSync(this.filePath, 'utf8');
            try {
                let expressionTree = esprima.parseModule(js);
                expressionTree.body = expressionTree.body.filter(x =>
                    !(x.type === stringConstants.EXPRESSION_STATEMENT && x.expression.type === stringConstants.ASSIGNMENT_EXPRESSION &&
                        x.expression.left && x.expression.left.object && x.expression.left.object.name === stringConstants.WILLCORE_CLASS_NAME
                        && x.expression.left.property.value === assignableName)
                );
                let code = codeGen.generate(expressionTree);
                fs.writeFileSync(this.filePath, code);
                return true;
            } catch (e) {
                return { message: stringConstants.PARSING_ERROR, error: e };
            }
        } catch (e) {
            return { message: stringConstants.MAIN_ERROR, error: e };
        }
    }

    /**
     * @private
     */
    getIndexes(expressionTree) {
        let startIndex = -1;
        let componentIndex = -1;
        let layoutIndex = -1;
        let viewIndex = -1;
        let componentLength = 0;
        let layoutLength = 0;
        let viewLength = 0;
        for (var i = 0; i < expressionTree.body.length; i++) {
            let currentExpression = expressionTree.body[i];
            if (currentExpression.type !== stringConstants.IMPORT_DECLARATION && startIndex === -1) {
                startIndex = i;
            }
            if (this.isComponent(currentExpression)) {
                if (componentIndex === -1) componentIndex = i;
                componentLength++;
            }
            if (this.isLayout(currentExpression)) {
                if (layoutIndex === -1) layoutIndex = i;
                layoutLength++;
            }
            if (this.isView(currentExpression)) {
                if (viewIndex === -1) viewIndex = i;
                viewLength++;
            }
        }
        return {
            componentIndex: componentIndex > -1 ? componentIndex : layoutIndex > -1 ? layoutIndex : viewIndex > -1 ? viewIndex : startIndex,
            layoutIndex: layoutIndex > -1 ? layoutIndex : componentIndex > -1 ? componentIndex + componentLength : viewIndex > -1 ? viewIndex : startIndex,
            viewIndex: viewIndex > -1 ? viewIndex : layoutIndex > -1 ? layoutIndex + layoutLength : componentIndex > -1 ? componentIndex + componentLength : startIndex
        };
    }

    /**
     * @private
     */
    isView(expression) {
        let isMember = expression.type === stringConstants.EXPRESSION_STATEMENT &&
            expression.expression.type === stringConstants.ASSIGNMENT_EXPRESSION &&
            expression.expression.left.type === stringConstants.MEMBER_EXPRESSION &&
            expression.expression.left.object.name === stringConstants.WILLCORE_CLASS_NAME &&
            expression.expression.right.type === stringConstants.ARRAY_EXPRESSION &&
            expression.expression.right.elements.length > 2 &&
            expression.expression.right.elements[0].type === stringConstants.MEMBER_EXPRESSION;
        if (isMember) {
            let memberparts = this.parseStaticMemberExpression(expression.expression.right.elements[0]);
            return memberparts.filter(x => x && x.startsWith("$")).length > 0;
        }
        return false;
    }

    /**
     * @private
     */
    parseStaticMemberExpression(expression) {
        if (expression.object && expression.object.object) {
            return [expression.object.object.name, expression.object.property.name, expression.property.name];
        } else {
            return [expression.object.name, expression.property.name];
        }
    }

    /**
     * @private
     */
    isComponent(expression) {
        return expression.type === stringConstants.EXPRESSION_STATEMENT &&
            expression.expression.type === stringConstants.ASSIGNMENT_EXPRESSION &&
            expression.expression.left.type === stringConstants.MEMBER_EXPRESSION &&
            expression.expression.left.object.name === stringConstants.WILLCORE_CLASS_NAME &&
            expression.expression.right.type === stringConstants.ARRAY_EXPRESSION &&
            expression.expression.right.elements.length === 4 &&
            expression.expression.right.elements[0].type === stringConstants.MEMBER_EXPRESSION &&
            expression.expression.right.elements[0].object.name === stringConstants.MODULE_CONTAINER &&
            expression.expression.right.elements[0].property.name === stringConstants.COMPONENT_CLASS_NAME
    }

    /**
     * @private
     */
    isLayout(expression) {
        return expression.type === stringConstants.EXPRESSION_STATEMENT &&
            expression.expression.type === stringConstants.ASSIGNMENT_EXPRESSION &&
            expression.expression.left.type === stringConstants.MEMBER_EXPRESSION &&
            expression.expression.left.object.name === stringConstants.WILLCORE_CLASS_NAME &&
            expression.expression.right.type === stringConstants.ARRAY_EXPRESSION &&
            expression.expression.right.elements.length === 3 &&
            expression.expression.right.elements[0].type === stringConstants.MEMBER_EXPRESSION &&
            expression.expression.right.elements[0].object.name === stringConstants.MODULE_CONTAINER &&
            expression.expression.right.elements[0].property.name === stringConstants.LAYOUT_CLASS_NAME
    }
}

module.exports = indexLinker;