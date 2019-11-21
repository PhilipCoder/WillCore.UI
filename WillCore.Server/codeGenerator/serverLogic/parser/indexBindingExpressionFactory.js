const expressionPartFactory = require("./expressionPartFactory.js");
const stringConstants = require("./expressionConstants.js");
/**
 * Factory class to build expression-trees for index binding generation.
 * 
 * Author: Philip Schoeman
 * */
class indexBindingExpressionFactory {
    /**
     * Builds an expression tree to bind a module to WillCore.
     * @param {string} componentName The name of the component.
     * @param {string} componentJSUrl The URL of the JS file for the component.
     * @param {string} componentHTMLUrl The URL of the HTML file for the component.
     */
    static getComponentExpression(componentName, componentJSUrl, componentHTMLUrl) {
        return {
            expression: expressionPartFactory.getAssignable(expressionPartFactory.willCoreAssignement(componentName),
                [
                    expressionPartFactory.memberExpression([stringConstants.MODULE_CONTAINER, stringConstants.COMPONENT_CLASS_NAME]),
                    expressionPartFactory.stringLitteral(componentJSUrl),
                    expressionPartFactory.stringLitteral(componentHTMLUrl),
                    expressionPartFactory.getEmptyObject()
                ]
            ),
            type: stringConstants.COMPONENT_CLASS_NAME
        };
    }
    /**
     * Builds an expression tree to bind a layout view to WillCore.
     * @param {string} name The name of the layout file.
     * @param {string} htmlURL The URL of the HTML file for the layout view.
     * @param {string} jsURL The URL of the JS file for the layout view.
     */
    static getLayoutExpression(name, htmlURL, jsURL) {
        return {
            expression: expressionPartFactory.getAssignable(expressionPartFactory.willCoreAssignement(name),
                [
                    expressionPartFactory.memberExpression([stringConstants.MODULE_CONTAINER, stringConstants.LAYOUT_CLASS_NAME]),
                    expressionPartFactory.stringLitteral(htmlURL),
                    expressionPartFactory.stringLitteral(jsURL)
                ]
            ),
            type: stringConstants.LAYOUT_CLASS_NAME
        };
    };
    /**
     * Builds an expression tree to bind a view to WillCore.
     * @param {string} viewName The name of the view.
     * @param {string} viewElement The element ID of the view, including the ID identifier.
     * @param {string} jsURL The URL of the JS file for the view.
     * @param {string} htmlURL The URL of the HTML file for the view.
     * @param {string} route The activation route of the view.
     */
    static getViewExpression(viewName, viewElement, jsURL, htmlURL, route) {
        return {
            expression: expressionPartFactory.getAssignable(expressionPartFactory.willCoreAssignement(viewName),
                [
                    expressionPartFactory.memberExpression([stringConstants.WILLCORE_CLASS_NAME, viewElement]),
                    expressionPartFactory.memberExpression([stringConstants.MODULE_CONTAINER, stringConstants.URL_CLASS_NAME]),
                    expressionPartFactory.stringLitteral(jsURL),
                    expressionPartFactory.memberExpression([stringConstants.MODULE_CONTAINER, stringConstants.URL_CLASS_NAME]),
                    expressionPartFactory.stringLitteral(htmlURL),
                    expressionPartFactory.memberExpression([stringConstants.MODULE_CONTAINER, stringConstants.ROUTE_CLASS_NAME]),
                    expressionPartFactory.stringLitteral(route),
                    expressionPartFactory.trueFunction()
                ]
            ),
            type: stringConstants.VIEW_CLASS_NAME
        };
    };
    /**
     * Builds an expression tree to bind a view with a layout to WillCore.
     * @param {string} viewName The name of the view.
     * @param {string} viewElement The element ID of the view, including the ID identifier.
     * @param {string} jsURL The URL of the JS file for the view.
     * @param {string} htmlURL The URL of the HTML file for the view.
     * @param {string} route The activation route of the view.
     * @param {string} layout The name of the layout view for the view.
     */
    static getViewWithLayoutExpression(viewName, viewElement, jsURL, htmlURL, route, layout) {
        return {
            expression: expressionPartFactory.getAssignable(expressionPartFactory.willCoreAssignement(viewName),
                [
                    expressionPartFactory.memberExpression([stringConstants.WILLCORE_CLASS_NAME, layout, viewElement]),
                    expressionPartFactory.memberExpression([stringConstants.MODULE_CONTAINER, stringConstants.URL_CLASS_NAME]),
                    expressionPartFactory.stringLitteral(jsURL),
                    expressionPartFactory.memberExpression([stringConstants.MODULE_CONTAINER, stringConstants.URL_CLASS_NAME]),
                    expressionPartFactory.stringLitteral(htmlURL),
                    expressionPartFactory.memberExpression([stringConstants.MODULE_CONTAINER, stringConstants.ROUTE_CLASS_NAME]),
                    expressionPartFactory.stringLitteral(route),
                    expressionPartFactory.trueFunction(),
                    expressionPartFactory.memberExpression([stringConstants.WILLCORE_CLASS_NAME, layout]),
                ]
            ),
            type: stringConstants.VIEW_CLASS_NAME
        };
    }
}

module.exports = indexBindingExpressionFactory;