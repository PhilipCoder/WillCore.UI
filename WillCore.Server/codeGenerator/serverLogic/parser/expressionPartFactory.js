const WILLCORE_CLASS_NAME = "willCore";
const ROUTE_CLASS_NAME = "route";
const LAYOUT_CLASS_NAME = "layout";
const COMPONENT_CLASS_NAME = "component";
const EXPRESSION_STATEMENT = "ExpressionStatement";
const MEMBER_EXPRESSION = "MemberExpression";
const IDENTIFIER_EXPRESSION = "Identifier";
const ASSIGNMENT_EXPRESSION = "AssignmentExpression";
const ARRAY_EXPRESSION = "ArrayExpression";
const LITERAL_EXPRESSION = "Literal";

/**
 * Factory for expression tree parts.
 * 
 * Author : Philip Schoeman
 * */
class expressionPartFactory {
    /**
     * Builds an object memeber expression from multipule parts
     * @param {ArrayLike<string>} parts
     */
    static memberExpression(parts) {
        if (parts.length < 2) {
            throw "A member expression should have at least two parts.";
        }
        let initialObject = {
            type: MEMBER_EXPRESSION,
            computed: false,
            object: {
                type: IDENTIFIER_EXPRESSION,
                name: parts[0]
            },
            property: {
                type: IDENTIFIER_EXPRESSION,
                name: parts[1]
            }
        };
        for (let i = 2; i < parts.length; i++) {
            let parentObject = {
                type: MEMBER_EXPRESSION,
                computed: false,
                object: initialObject,
                property: {
                    type: IDENTIFIER_EXPRESSION,
                    name: parts[i]
                }
            };
            initialObject = parentObject;
        }
        return initialObject;
    }

    static getAssignable(proxyAssignment, arrayAssignment) {
        return {
            type: "ExpressionStatement",
            expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: proxyAssignment
                , right: expressionPartFactory.getArray(
                    arrayAssignment
                )
            }
        }
    }
    static getArray(arrayExpressionItems) {
        return {
            type: "ArrayExpression",
            elements: arrayExpressionItems
        }
    }
    static willCoreAssignement(assignableName) {
        return {
            type: MEMBER_EXPRESSION,
            "computed": true,
            object: {
                type: "Identifier",
                name: WILLCORE_CLASS_NAME
            },
            property:
            {
                type: "Literal",
                value: assignableName,
                raw: `"${assignableName}"`
            }
        }
    }
    static stringLitteral(value) {
        return {
            type: "Literal",
            value: value,
            raw: `'${value}'`
        };
    }
    static getEmptyObject() {
        return {
            type: "ObjectExpression",
            properties: []
        };
    }
    static trueFunction() {
        return {
            type: "ArrowFunctionExpression",
            id: null,
            params: [
                {
                    "type": "Identifier",
                    "name": "x"
                }
            ],
            body: {
                type: "Literal",
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