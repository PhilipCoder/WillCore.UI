const stringConstants = require("./expressionConstants.js");

/**
 * Factory for expression tree parts.
 * 
 * Author : Philip Schoeman
 * */
class expressionPartFactory {
    /**
     * Builds an object member expression from multiple parts
     * 
     * @param {ArrayLike<string>} parts
     */
    static memberExpression(parts) {
        if (parts.length < 2) {
            throw stringConstants.EXPRESSION_PART_MIN_ERROR;
        }
        let initialObject = {
            type: stringConstants.MEMBER_EXPRESSION,
            computed: false,
            object: {
                type: stringConstants.IDENTIFIER_DECLARATION,
                name: parts[0]
            },
            property: {
                type: stringConstants.IDENTIFIER_DECLARATION,
                name: parts[1]
            }
        };
        for (let i = 2; i < parts.length; i++) {
            let parentObject = {
                type: stringConstants.MEMBER_EXPRESSION,
                computed: false,
                object: initialObject,
                property: {
                    type: stringConstants.IDENTIFIER_DECLARATION,
                    name: parts[i]
                }
            };
            initialObject = parentObject;
        }
        return initialObject;
    }

    /**
     * Builds an expression tree to assign an assignable via an array to a proxy
     * 
     * @param {object} proxyAssignment Expression tree for the proxy object assignment left of the =
     * @param {ArrayLike<object>} arrayAssignment An array of expression trees that will be assigned via an array
     */
    static getAssignable(proxyAssignment, arrayAssignment) {
        return {
            type: stringConstants.EXPRESSION_STATEMENT,
            expression: {
                type: stringConstants.ASSIGNMENT_EXPRESSION,
                operator: "=",
                left: proxyAssignment
                , right: expressionPartFactory.getArray(
                    arrayAssignment
                )
            }
        }
    }

    /**
     * Gets an array expression tree.
     * 
     * @param {ArrayLike<object>} arrayExpressionItems An array of expression trees that will be assigned to an array
     */
    static getArray(arrayExpressionItems) {
        return {
            type: stringConstants.ARRAY_EXPRESSION,
            elements: arrayExpressionItems
        }
    }

    /**
     * Gets an expression tree to assign complex names to the willCore proxy object
     * 
     * @param {sting} assignableName Name of the assignable, can contain special characters.
     */
    static willCoreAssignement(assignableName) {
        return {
            type: stringConstants.MEMBER_EXPRESSION,
            computed: true,
            object: {
                type: stringConstants.IDENTIFIER_DECLARATION,
                name: stringConstants.WILLCORE_CLASS_NAME
            },
            property:
            {
                type: stringConstants.LITERAL_EXPRESSION,
                value: assignableName,
                raw: `"${assignableName}"`
            }
        }
    }

    /**
     * Gets an expression tree for a string litteral
     * 
     * @param {string} value Value of the string litteral
     */
    static stringLitteral(value) {
        return {
            type: stringConstants.LITERAL_EXPRESSION,
            value: value,
            raw: `'${value}'`
        };
    }

    /**
     * Gets an expression tree for an empty object
     * */
    static getEmptyObject() {
        return {
            type: stringConstants.OBJECT_EXPRESSION,
            properties: []
        };
    }

    /**
     * Gets an expression tree for an array function that returns true.
     * */
    static trueFunction() {
        return {
            type: stringConstants.ARROW_FUNCTION,
            id: null,
            params: [
                {
                    type: stringConstants.IDENTIFIER_DECLARATION,
                    name: stringConstants.DEFAULT_ARROW_FUNCTION_PARAMETER
                }
            ],
            body: {
                type: stringConstants.LITERAL_EXPRESSION,
                value: true,
                raw: "true"
            },
            generator: false,
            expression: true,
            async: false
        }
    }
}

module.exports = expressionPartFactory;