const esprima = require("../../libraries/esprima/esprima_amd.js");
const codeGen = require("../../libraries/escodegen/escodegen.js");
const indexBindingFactory = require("./indexBindingExpressionFactory.js");


const fs = require("fs");

const MAIN_ERROR = "Error loading index file.";
const PARSING_ERROR = "Error parsing index file.";
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

class indexLinker {
    constructor(filePath) {
        this.filePath = filePath;
    }

    addBinding(binding) {
        try {
            let js = fs.readFileSync(this.filePath, 'utf8');
            try {
                let expressionTree = esprima.parseModule(js);
                var views = expressionTree.body.filter(x=>this.isView(x));
                var components = expressionTree.body.filter(x => this.isComponent(x));
                var layouts = expressionTree.body.filter(x => this.isLayout(x));



                debugger;
                // fs.writeFileSync(this.filePath, code);
            } catch (e) {
                return { message: PARSING_ERROR, error: e };
            }
        } catch (e) {
            return { message: MAIN_ERROR, error: e };
        }
    }

    removeBinding(componentName) {
        try {
            let js = fs.readFileSync(this.filePath, 'utf8');
            try {
                let expressionTree = esprima.parseModule(js);
                let newViewExpression = indexBindingFactory.getComponentExpression("superComponenet", "/lol.js", "/lol.html");
                expressionTree.body.push(newViewExpression.expression);
                expressionTree.body = expressionTree.body.filter(x =>
                    !(x.type === EXPRESSION_STATEMENT && x.expression.type === ASSIGNMENT_EXPRESSION &&
                        x.expression.left && x.expression.left.object && x.expression.left.object.name === WILLCORE_CLASS_NAME
                        && x.expression.left.property.value === componentName)
                );
                let code = codeGen.generate(expressionTree);
                debugger;
               // fs.writeFileSync(this.filePath, code);
            } catch (e) {
                return { message: PARSING_ERROR, error: e };
            }
        } catch (e) {
            return { message: MAIN_ERROR, error: e };
        }
    }

    isView(expression) {
        let isMember = expression.type === EXPRESSION_STATEMENT &&
            expression.expression.type === ASSIGNMENT_EXPRESSION &&
            expression.expression.left.type === MEMBER_EXPRESSION &&
            expression.expression.left.object.name === WILLCORE_CLASS_NAME &&
            expression.expression.right.type === ARRAY_EXPRESSION &&
            expression.expression.right.elements.length > 2 &&
            expression.expression.right.elements[0].type === MEMBER_EXPRESSION;
        if (isMember) {
            let memberparts = this.parseStaticMemberExpression(expression.expression.right.elements[0]);
            return memberparts.filter(x => x.startsWith("$")).length > 0;
        }
        return false;
    }

    parseStaticMemberExpression(expression) {
        if (expression.object && expression.object.object) {
            return [expression.object.object.name, expression.object.property.name, expression.property.name];
        } else {
            return [expression.object.name, expression.property.name];
        }
    }

    isComponent(expression) {
        return expression.type === EXPRESSION_STATEMENT &&
            expression.expression.type === ASSIGNMENT_EXPRESSION &&
            expression.expression.left.type === MEMBER_EXPRESSION &&
            expression.expression.left.object.name === WILLCORE_CLASS_NAME && 
            expression.expression.right.type === ARRAY_EXPRESSION &&
            expression.expression.right.elements.length === 4 &&
            expression.expression.right.elements[0].type === MEMBER_EXPRESSION &&
            expression.expression.right.elements[0].object.name === MODULE_CONTAINER &&
            expression.expression.right.elements[0].property.name === COMPONENT_CLASS_NAME
    }

    isLayout(expression) {
        return expression.type === EXPRESSION_STATEMENT &&
            expression.expression.type === ASSIGNMENT_EXPRESSION &&
            expression.expression.left.type === MEMBER_EXPRESSION &&
            expression.expression.left.object.name === WILLCORE_CLASS_NAME &&
            expression.expression.right.type === ARRAY_EXPRESSION &&
            expression.expression.right.elements.length === 3 &&
            expression.expression.right.elements[0].type === MEMBER_EXPRESSION &&
            expression.expression.right.elements[0].object.name === MODULE_CONTAINER &&
            expression.expression.right.elements[0].property.name === LAYOUT_CLASS_NAME
    }
}

module.exports = indexLinker;