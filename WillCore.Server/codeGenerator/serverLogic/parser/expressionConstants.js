/**
 * Constant string literals used in expression trees
 * 
 * Author : Philip Schoeman
 * */

const expressionConstants = {
    MODULE_CONTAINER : "willCoreModules",
    WILLCORE_CLASS_NAME : "willCore",
    ROUTE_CLASS_NAME : "route",
    LAYOUT_CLASS_NAME : "layout",
    VIEW_CLASS_NAME : "view",
    COMPONENT_CLASS_NAME : "component",
    URL_CLASS_NAME : "url",
    EXPRESSION_STATEMENT : "ExpressionStatement",
    MEMBER_EXPRESSION : "MemberExpression",
    ASSIGNMENT_EXPRESSION : "AssignmentExpression",
    ARRAY_EXPRESSION : "ArrayExpression",
    LITERAL_EXPRESSION : "Literal",
    JS_FILE_INDICATOR : ".js",
    HTML_FILE_INDICATOR : ".html",
    ELEMENT_INDICATOR : "$",
    IMPORT_DECLARATION: "ImportDeclaration",
    IDENTIFIER_DECLARATION: "Identifier",
    OBJECT_EXPRESSION: "ObjectExpression",
    ARROW_FUNCTION: "ArrowFunctionExpression",
    DEFAULT_ARROW_FUNCTION_PARAMETER:"x",

    MAIN_ERROR: "Error loading index file.",
    PARSING_ERROR: "Error parsing index file.",
    VIEWS_ERROR: "Error parsing views from index file.",
    COMPONENT_ERROR: "Error parsing components from index file.",
    LAYOUT_ERROR: "Error parsing layouts from index file.",
    EXPRESSION_PART_MIN_ERROR: "A member expression should have at least two parts."
};

module.exports = expressionConstants;