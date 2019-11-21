const esprima = require("../../libraries/esprima/esprima_amd.js");
const codeGen = require("../../libraries/escodegen/escodegen.js");
const stringConstants = require("./expressionConstants.js");
const expresssionMatcher = require("./expressionMatcher.js");

const fs = require("fs");

const MODULE_CONTAINER = "willCoreModules";
const WILLCORE_CLASS_NAME = "willCore";
const ROUTE_CLASS_NAME = "route";
const LAYOUT_CLASS_NAME = "layout";
const COMPONENT_CLASS_NAME = "component";
const EXPRESSION_STATEMENT = "ExpressionStatement";
const MEMBER_EXPRESSION = "MemberExpression";
const ASSIGNMENT_EXPRESSION = "AssignmentExpression";
const ARRAY_EXPRESSION = "ArrayExpression";
const LITERAL_EXPRESSION = "Literal";
const JS_FILE_INDICATOR = ".js";
const HTML_FILE_INDICATOR = ".html";
const ELEMENT_INDICATOR = "$";
const MAIN_ERROR = "Error loading index file.";
const PARSING_ERROR = "Error parsing index file.";
const VIEWS_ERROR = "Error parsing views from index file.";
const COMPONENT_ERROR = "Error parsing components from index file.";
const LAYOUT_ERROR = "Error parsing layouts from index file.";

class indexParser {
    constructor(filePath) {
        this.filePath = filePath;
    }

    processIndexFile() {
        try {
            let js = fs.readFileSync(this.filePath, 'utf8');
            try {
                let expressionTree = esprima.parseModule(js);
                var code = codeGen.generate(expressionTree);
                let willCoreAssignedStatements = expressionTree.body.filter(x =>
                    x.type === EXPRESSION_STATEMENT && x.expression.type === ASSIGNMENT_EXPRESSION &&
                    x.expression.left && x.expression.left.object && x.expression.left.object.name === WILLCORE_CLASS_NAME
                );
                var expressionParts = this.parseExpressions(willCoreAssignedStatements);
                try {
                    var views = this.getViews(expressionParts);
                    try {
                        var components = this.getComponents(expressionParts);
                        try {
                            var layouts = this.getLayouts(expressionParts);
                            return { views: views, components: components, layouts: layouts };
                        } catch (e) {
                            return { message: LAYOUT_ERROR, error: e };
                        }
                    } catch (e) {
                        return { message: COMPONENT_ERROR, error: e };
                    }
                } catch (e) {
                    return { message: VIEWS_ERROR, error: e };
                }
            } catch (e) {
                return { message: PARSING_ERROR, error: e };
            }
        } catch (e) {
            return { message: MAIN_ERROR, error: e };
        }
    }

    getComponents(expressions) {
        return expressions.filter(x => this.isComponent(x.arrayExpressions)).map(x => ({
            name: x.name,
            jsUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(JS_FILE_INDICATOR))[0][0],
            htmlUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(HTML_FILE_INDICATOR))[0][0]
        }));
    }

    getLayouts(expressions) {
        return expressions.filter(x => this.isLayout(x.arrayExpressions)).map(x => ({
            name: x.name,
            jsUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(JS_FILE_INDICATOR))[0][0],
            htmlUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(HTML_FILE_INDICATOR))[0][0]
        }));
    }

    getViews(expressions) {
        return expressions.filter(x => this.isView(x.arrayExpressions)).map(x => ({
            element: x.arrayExpressions[0][x.arrayExpressions[0].length - 1],
            name: x.name,
            jsUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(JS_FILE_INDICATOR))[0][0],
            htmlUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(HTML_FILE_INDICATOR))[0][0],
            route: getRoute(x.arrayExpressions),
            layout: ((layoutArr) => layoutArr.length > 0 ? layoutArr[0][1] : null)(x.arrayExpressions.filter(j => j.length === 2 && j[0] === "willCore" && !j[1].startsWith("$")))
        }));

        function getRoute(array) {
            for (var i = 0; i < array.length; i++) {
                var node = array[i];
                if (node.length === 2 && node[0] === MODULE_CONTAINER && node[1] === ROUTE_CLASS_NAME) {
                    return array[i + 1][0];
                }
            }
        }
    }

    parseExpressions(statements) {
        return statements.filter(x =>
            x.expression.right.type === ARRAY_EXPRESSION && x.expression.right.elements.length > 0 &&
            ((firstExpression) => firstExpression.type === MEMBER_EXPRESSION
            )).map(x => ({
                name: x.expression.left.property.name || x.expression.left.property.value,
                arrayExpressions: this.getArrayExpressionParts(x.expression.right.elements)
            }));
    }

    isLayout(parts) {
        return parts[0][0] === MODULE_CONTAINER && parts[0][1] === LAYOUT_CLASS_NAME;
    }

    isComponent(parts) {
        return parts[0][0] === MODULE_CONTAINER && parts[0][1] === COMPONENT_CLASS_NAME;
    }

    isView(parts) {
        return parts[0].filter(x => x.startsWith(ELEMENT_INDICATOR)).length > 0;
    }

    getArrayExpressionParts(array) {
        return array.map(expression => this.getExpressionParts(expression)).filter(x => x);
    }

    getExpressionParts(expression) {
        if (expression.type === MEMBER_EXPRESSION) {
            return this.parseStaticMemberExpression(expression);
        } else if (expression.type === LITERAL_EXPRESSION) {
            return this.parseLITERAL_EXPRESSION(expression);
        }
        return null;
    }

    parseLITERAL_EXPRESSION(expression) {
        return [expression.value];
    }

    parseStaticMemberExpression(expression) {
        if (expression.object && expression.object.object) {
            return [expression.object.object.name, expression.object.property.name, expression.property.name];
        } else {
            return [expression.object.name, expression.property.name];
        }
    }

}

module.exports = indexParser;