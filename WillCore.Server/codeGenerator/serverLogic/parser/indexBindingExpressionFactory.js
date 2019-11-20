class indexBindingExpressionFactory {
    static getComponentExpression(componentName, componentJSUrl, componentHTMLUrl) {
        return {
            expression: {
                type: "ExpressionStatement",
                expression: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left: {
                        type: "MemberExpression",
                        "computed": true,
                        object: {
                            type: "Identifier",
                            name: "willCore"
                        },
                        property:
                        {
                            type: "Literal",
                            value: componentName,
                            raw: `"${componentName}"`
                        }
                    }, right: {
                        type: "ArrayExpression",
                        elements: [
                            {
                                type: "MemberExpression",
                                computed: false,
                                object: {
                                    type: "Identifier",
                                    name: "willCoreModules"
                                },
                                property: {
                                    type: "Identifier",
                                    name: "component"
                                }
                            },
                            {
                                type: "Literal",
                                value: componentJSUrl,
                                raw: `"${componentJSUrl}"`
                            }, {
                                type: "Literal",
                                value: componentHTMLUrl,
                                raw: `"${componentHTMLUrl}"`
                            }, {
                                type: "ObjectExpression",
                                properties: []
                            }]
                    }
                }
            },
            type: "component"
        };
    }

    static getLayoutExpression(name, htmlURL, jsURL) {
        return {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "willCore"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": name
                    }
                },
                "right": {
                    "type": "ArrayExpression",
                    "elements": [
                        {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "willCoreModules"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "layout"
                            }
                        },
                        {
                            "type": "Literal",
                            "value": htmlURL,
                            "raw": `"${htmlURL}"`
                        },
                        {
                            "type": "Literal",
                            "value": jsURL,
                            "raw": `"${jsURL}"`
                        }
                    ]
                }
            }
        };
    }
}

module.exports = indexBindingExpressionFactory;