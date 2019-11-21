const esprima = require("../../libraries/esprima/esprima_amd.js");
const codeGen = require("../../libraries/escodegen/escodegen.js");
const stringConstants = require("./expressionConstants.js");
const expresssionMatcher = require("./expressionMatcher.js");
const fs = require("fs");

/**
 * Parser to load all binded assignables from the index.js file.
 * */
class indexParser {
    /**
     * Creates an instance of the index parser.
     * @param {string} filePath Full path of the index file to be parsed.
     */
    constructor(filePath) {
        this.filePath = filePath;
    }

    /**
     * Method to parse the index file and return an object with all the assignables in the file
     * */
    processIndexFile() {
        try {
            let js = fs.readFileSync(this.filePath, 'utf8');
            try {
                let expressionTree = esprima.parseModule(js);
                let willCoreAssignedStatements = expressionTree.body.filter(x =>
                    x.type === stringConstants.EXPRESSION_STATEMENT && x.expression.type === stringConstants.ASSIGNMENT_EXPRESSION &&
                    x.expression.left && x.expression.left.object && x.expression.left.object.name === stringConstants.WILLCORE_CLASS_NAME
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
                            return { message: stringConstants.LAYOUT_ERROR, error: e };
                        }
                    } catch (e) {
                        return { message: stringConstants.COMPONENT_ERROR, error: e };
                    }
                } catch (e) {
                    return { message: stringConstants.VIEWS_ERROR, error: e };
                }
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
    getComponents(expressions) {
        return expressions.filter(x => this.isComponent(x.arrayExpressions)).map(x => ({
            name: x.name,
            jsUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(stringConstants.JS_FILE_INDICATOR))[0][0],
            htmlUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(stringConstants.HTML_FILE_INDICATOR))[0][0]
        }));
    }
    /**
    * @private
    */
    getLayouts(expressions) {
        return expressions.filter(x => this.isLayout(x.arrayExpressions)).map(x => ({
            name: x.name,
            jsUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(stringConstants.JS_FILE_INDICATOR))[0][0],
            htmlUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(stringConstants.HTML_FILE_INDICATOR))[0][0]
        }));
    }
    /**
    * @private
    */
    getViews(expressions) {
        return expressions.filter(x => this.isView(x.arrayExpressions)).map(x => ({
            element: x.arrayExpressions[0][x.arrayExpressions[0].length - 1],
            name: x.name,
            jsUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(stringConstants.JS_FILE_INDICATOR))[0][0],
            htmlUrl: x.arrayExpressions.filter(j => j.length === 1 && j[0].endsWith(stringConstants.HTML_FILE_INDICATOR))[0][0],
            route: getRoute(x.arrayExpressions),
            layout: ((layoutArr) => layoutArr.length > 0 ? layoutArr[0][1] : null)(x.arrayExpressions.filter(j => j.length === 2 && j[0] === stringConstants.WILLCORE_CLASS_NAME && !j[1].startsWith(stringConstants.ELEMENT_INDICATOR)))
        }));

        function getRoute(array) {
            for (var i = 0; i < array.length; i++) {
                var node = array[i];
                if (node.length === 2 && node[0] === stringConstants.MODULE_CONTAINER && node[1] === stringConstants.ROUTE_CLASS_NAME) {
                    return array[i + 1][0];
                }
            }
        }
    }
    /**
    * @private
    */
    parseExpressions(statements) {
        return statements.filter(x =>
            x.expression.right.type === stringConstants.ARRAY_EXPRESSION && x.expression.right.elements.length > 0 &&
            ((firstExpression) => firstExpression.type === stringConstants.MEMBER_EXPRESSION
            )).map(x => ({
                name: x.expression.left.property.name || x.expression.left.property.value,
                arrayExpressions: this.getArrayExpressionParts(x.expression.right.elements)
            }));
    }
    /**
    * @private
    */
    isLayout(parts) {
        return parts[0][0] === stringConstants.MODULE_CONTAINER && parts[0][1] === stringConstants.LAYOUT_CLASS_NAME;
    }
    /**
    * @private
    */
    isComponent(parts) {
        return parts[0][0] === stringConstants.MODULE_CONTAINER && parts[0][1] === stringConstants.COMPONENT_CLASS_NAME;
    }
    /**
    * @private
    */
    isView(parts) {
        return parts[0].filter(x => x.startsWith(stringConstants.ELEMENT_INDICATOR)).length > 0;
    }
    /**
    * @private
    */
    getArrayExpressionParts(array) {
        return array.map(expression => this.getExpressionParts(expression)).filter(x => x);
    }
    /**
    * @private
    */
    getExpressionParts(expression) {
        if (expression.type === stringConstants.MEMBER_EXPRESSION) {
            return this.parseStaticMemberExpression(expression);
        } else if (expression.type === stringConstants.LITERAL_EXPRESSION) {
            return this.parseLiteral(expression);
        }
        return null;
    }
    /**
    * @private
    */
    parseLiteral(expression) {
        return [expression.value];
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

}

module.exports = indexParser;