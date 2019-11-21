const path = require('path');
const fs = require("fs");
const indexBindingExpressionFactory = require("./parser/indexBindingExpressionFactory.js");
const indexLinker = require("./parser/indexLinker.js");
const indexParser = require("./parser/indexParser.js");

/**
 * The core class to interact with the index file
 * 
 * Author: Philip Schoeman
 * */
class indexCore {
    constructor() {
        /**@private */
        this.indexPath = path.resolve(__dirname, `../../wwwRoot/index.js`);
        /**@private */
        this.indexLinker = new indexLinker(this.indexPath);
        /**@private */
        this.indexParser = new indexParser(this.indexPath);
    }

    /**
     * Indicates if the index file exists - read only.
     * @type boolean
     * */
    get exists() {
        return fs.existsSync(this.indexPath);
    }

    /**
     * Assignables linked to the index file - read only.
     * 
     * @type object
     * */
    get linkedAssignables() {
        return this.indexParser.processIndexFile();
    }

    /**
     * Links a view assignable to the index file.
     * 
     * @param {string} viewName The name of the view.
     * @param {string} viewElement The element ID of the view, including the ID identifier.
     * @param {string} jsURL The URL of the JS file for the view.
     * @param {string} htmlURL The URL of the HTML file for the view.
     * @param {string} route The activation route of the view.
     */
    addView(viewName, viewElement, jsURL, htmlURL, route) {
        let viewCodeExpression = indexBindingExpressionFactory.getViewExpression(viewName, viewElement, jsURL, htmlURL, route).expression;
        return this.indexLinker.addBinding(viewCodeExpression);
    }

    /**
     * Links a view with a layout to the index file.
     * 
     * @param {string} viewName The name of the view.
     * @param {string} viewElement The element ID of the view, including the ID identifier.
     * @param {string} jsURL The URL of the JS file for the view.
     * @param {string} htmlURL The URL of the HTML file for the view.
     * @param {string} route The activation route of the view.
     * @param {string} layout The name of the layout view for the view.
     */
    addViewWithLayout(viewName, viewElement, jsURL, htmlURL, route, layout) {
        let viewWithLayoutCodeExpression = indexBindingExpressionFactory.getViewWithLayoutExpression(viewName, viewElement, jsURL, htmlURL, route, layout).expression;
        return this.indexLinker.addBinding(viewWithLayoutCodeExpression);
    }

    /**
    * Links a layout to the index file.
    * 
    * @param {string} name The name of the layout file.
    * @param {string} htmlURL The URL of the HTML file for the layout view.
    * @param {string} jsURL The URL of the JS file for the layout view.
    */
    addLayout(name, htmlURL, jsURL) {
        let layoutCodeExpression = indexBindingExpressionFactory.getLayoutExpression(name, htmlURL, jsURL).expression;
        return this.indexLinker.addBinding(layoutCodeExpression);
    }

    /**
    * Links a component to the index file.
    * 
    * @param {string} componentName The name of the component.
    * @param {string} componentJSUrl The URL of the JS file for the component.
    * @param {string} componentHTMLUrl The URL of the HTML file for the component.
    */
    addComponent(componentName, componentJSUrl, componentHTMLUrl) {
        let componentCodeExpression = indexBindingExpressionFactory.getComponentExpression(componentName, componentJSUrl, componentHTMLUrl).expression;
        return this.indexLinker.addBinding(componentCodeExpression);
    }
}

module.exports = indexCore;