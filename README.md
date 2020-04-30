<p align="center">
<img src="res/WillCoreLogo.png"  />
<h1 align="center">WillCore.UI</h1>
<h5 align="center">Simple, Fast And Powerfull Client-Side HTML UI Framework - By Philip Schoeman</h5>
<h5 align="center" style="color:red">DOCUMENTATION IS A WORK IN  PROGRESS.</h5>
</p>

___

> WillCore.UI is a framework that makes building a client-side rendered single paged application easy. Fast and small, but yet powerful, it requires no pre-compilers and everything is coded in ES6.

___

### Why Another JavaScript Framework?

With so many JS UI frameworks popping up, it is hard to keep up to date with all the new front-end libraries. Most of them are over complicated, requires pre-compilers, and take ages just to set them up. That is why WillCore.UI was born, a simple but yet powerful framework was needed to not only build websites, but also PWAs with offline functionality.

###### WillCore.UI has a simple API and can be learned in a day (disclaimer: excluding people with impaired cognitive functionality). 
___
> ### Index
___

1. [Assignable Introduction](#Assignable-Introduction)
2. [Getting Started](#Getting-Started)
   1. [Without CLI](#Without-CLI)
   2. [With CLI](#With-CLI)
3. [Architecture Overview](#Architecture-Overview)
   1. [The WillCore Proxy](#The-WillCore-Proxy)
   2. [The View Proxy](#The-View-Proxy)
4. [Views](#Views)
5. [View Layouts](#View-Layouts)
6. [Collections And Model Binding](#Collections-And-Model-Binding)
   1. [WillCore.UI Model Binding](#WillCore.UI-Model-Binding)
   2. [Model](#Model)
   3. [Inner HTML](#Inner-HTML)
   4. [Repeat](#Repeat)
   5. [Events](#Events)
   6. [Attributes](#Attributes)
   7. [Partial Views](#Partial-Views)
7. [HTTP requests](#HTTP-requests)
8. [Collection Targets And Sources](#Collection-Targets-And-Sources)
9. [Routing](#Routing)
10. [Runtime Creation Of HTML DOM Elements](#Runtime-Creation-Of-HTML-DOM-Elements)
___
> ### 1) Assignable-Introduction
___

In order to make the API as simple as possible, WC.UI (WillCore.UI) uses the concept of assignables to instantiate and assign state to internal objects. The concept might be a bit weird at first, but it simplifies the API.

<br/>

E1) Let's take the following example:

```javascript
//Creates an instance of the attribute class and assign values to it.
view.$elementId.attribute = new attribute(view);
//Assign the attributeField property on the instance
view.$elementId.attribute.attributeField = "style";
//Assign the value function on the attribute instance
view.$elementId.attribute.valueFunction = () => ({ color: "red" });
```

In the example above we use traditional Class or Function instantiation and then we assign properties to the instance. But by doing so we are expecting the programmer to know the API and what values to assign. But what if the class itself knew what values to assign where? That is where assignables come in.

<br/>

E2) Doing it the assignable way:

```javascript
//Assigning the class "attribute", the framework knows how to create an instance and where it should live.
view.$elementId = attribute;
//Assigning the attribute field to the attribute.
view.$elementId = "style";
//Assigning the value function.
view.$elementId = () => ({ color: "red" });
```
<br/>

>The two examples above do the exact same thing. 
When the class is assigned to $elementId, the framework checks if the class inherits from an assignable. Then it creates an instance of the attribute class. The instance of the attribute class then tells WillCore.UI that it needs 1 string and 1 function to complete assignment. When the string and function is assigned, the attribute class initiates itself and the instance is removed from 
the $elementId object.

<br/>

E3) The assignable and it's properties can also be assigned via an array:

```javascript
view.$elementId = [attribute,"style", () => ({ color: "red" })];
```

<br/>

E4) Dot notation can be used on the assignable and string fields:

```javascript
view.$elementId.attribute.style = () => ({ color: "red" });
```
<br/>

Examples 2,3 and 4 all do the same thing. Assignables are the core of WillCore.UI's API and all interaction with the framework is done via assignables.

___
> ### 2) Getting Started
___

A simple, "Hello World" application to demonstrate how to setup a WillCore.UI website.

>#### Without CLI

1. Make a new website in your web server (IIS or Apache) and copy the willCore.UI modules [(from here)](https://github.com/PhilipCoder/WillCore.UI/tree/master/WillCore.UI/wwwroot/willCore) to a folder named willCore in the root of your website.
2. First we have to create an index HTML page. This page servers as a main entry point to your application as well as a default layout page. Create a file, "index.html", in the root of the website with the following contents:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>WillCore.UI Demo</title>
    <script type="module" defer src="/index.js"></script>
</head>
<body>
    <div id="mainContentDiv">
    </div>
</body>
</html>
```

3. Next we have to create the index JavaScript module. This module defines views, layouts, authorization and routing to views. Create a file, "index.js", in the root of your website:

```javascript
import { willCore, url, route } from "./willCore/WillCore.js";
//Define the home page view. The view should load into the div with ID "mainContentDiv", load when the route is "/" and users should always have access to it.
willCore.loginPage = [willCore.$mainContentDiv, url, "/home.js", url, "/home.html", route, "/", x => true];
//Navigate to the home page
willCore("/");
```

4. We have now defined the view container of the SPA. Next we actually have to create the files for the home page view. Create a file home.html in the route of your website:

```html
<!--- Inline CSS == "BAD". This is only for demo purposes. --->
<div style="text-align:center">
    <h1 id="greetingOutput"></h1>
</div>
```

5. Lastly we have to create the JS for the view. Create a file "home.js", also in the root of the website:

```javascript
//A view module must always export a function
var view = async (view) => {
    //Define a collection:
    view.greeting = { message: "Hello World" };
    //Binds the heading's inner HTML to the property on the collection:
    view.$greetingOutput.innerHTML = () => view.greeting.message;
};

export { view };
```

<br/>

Open the website, you should see the following page:

<p align="center">
<img src="res/setupNoCLIResult.PNG"  />
</p>

_The source files for this example can be downloaded [here](https://github.com/PhilipCoder/WillCore.UI/tree/master/Example.WithoutCLI)._

>#### With CLI

WillCore.UI has a CLI that can be used to create the index file, views, layouts and download the WillCore source files. It also provides intellise support for Visual Studio, configures the correct file nesting for a solution and enforces a good code structure.

1. Download the CLI from [here](https://github.com/PhilipCoder/WillCore.UI/raw/master/WillCore.UI/Dist/CLI.zip) (*make sure you have the latest .NET Core Runtime installed*). Extract the zip file to a directory and run the .exe as administrator.
2. You should see the following window:

<p align="center">
<img src="res/CLIHome.PNG"  />
</p>

3. Paste the path to the root directory of your website into the CLI and press enter. Keep the CLI open while you work.
4. Create a new "index.html" file in the root of your website. The CLI should have created an index.js file.
5. Create a new "home.html" file in the root of your website. The CLI should have created the following files:
6. The CLI should have created the following files:

<p align="center">
<img src="res/viewFilesCreated.PNG"  />
</p>

7. Replace the content of the home.html file with the following:

```html
<!--- Inline CSS == "BAD". This is only for demo purposes. --->
<div style="text-align:center">
    <h1 id="greetingOutput"></h1>
</div>
```

8. Next we need to define the data collection. Edit the home.collections.js file and add the following line to the collection function:

```javascript
 view.greeting = { message: "Hello World" };
```

The home.collections.js file should now look like this:

```javascript
/**
 * Builds up the collections that are used by the view.
 * 
 * @typedef {import("./home.meta.js").viewMetaData} view
 * @param {view} view
 * @param {object} configuration
 */
var collections = async (view, configuration) => {
    view.greeting = { message: "Hello World" };
};

export { collections };
```

9. To add the binding, edit home.bindings.js and add this line to the bindings function:

```javascript
    view.$greetingOutput.innerHTML = () => view.greeting.message;
```

The home.bindings.js file should now look like this:

```javascript
/**
 * Binds the HTML elements to the collections.
 * Binding module
 * 
 * @typedef {import("./home.meta.js").viewMetaData} view
 * @param {view} view
 */
var bindings = async (view) => {
    view.$greetingOutput.innerHTML = () => view.greeting.message;
};

export { bindings };
```

10. Uncomment the commented out line in index.js:

```javascript
import { willCore, url, route, layout } from "./willCore/WillCore.js";

willCore.home = [willCore.$mainContentDiv, url, "/home.js", url, "/home.html", route, "/", x => true];

willCore("/");
```

11. Now we need the WillCore.UI modules. Simply make a folder named "willCore" in the root of your website. The CLI should now have added the source files to the folder.

<br/>

Open the website, you should see the following page:

<p align="center">
<img src="res/setupNoCLIResult.PNG"  />
</p>

_The source files for this example can be downloaded [here](https://github.com/PhilipCoder/WillCore.UI/tree/master/Example.WithoutCLI)._

___
>### 3) Architecture Overview
___

<p align="center">
<img src="res/architectureOverview.svg"  />
</p>

Interfacing with the WillCore.UI API is done via only 2 objects. The WillCore instance that can be imported from the WillCore.js module and the view instance. The view instance gets passed to the JS file of a view via the function exported from the view. 

>##### The WillCore Proxy 

The WillCore proxy object can be imported from the main WillCore module. This object is used for 2 actions: define views (main views and layout views) and routing. This is done in the index.js file. To import the proxy:


```javascript
import { willCore } from "./willCore/WillCore.js";
```

<br/>

>###### Accessing HTML Elements From The Index.html File

Views can be loaded into HTML elements (divs) on the index.html file:

```html
<!--- index.html --->
 <div id="containerElement"></div>
```

To access the element:

```javascript
//===================================================================
//index.js
//===================================================================

import { willCore } from "./willCore/WillCore.js";
willCore.$containerElement;
```

Element IDs are indicated by a leading dollar sign ($). To load a view into the div, see the section on views.

>###### The View Proxy

The view proxy is used for all view related operations. Model binding, HTML events and to define partial views. The view proxy is the first parameter of the exported function of a view:

```javascript
//===================================================================
//homepage.js
//===================================================================

var view = async (view) => {

};

export { view };
```

___
>### 4) Views
___

A willCore application must have at least one view. Views consist of a HTML file and at least one JS module.

There are 3 types of views. Main views, partial views and layout views. They all expose the same API via the view proxy object, but are defined differently.

>#### Main View

Main views are activated via a change in the hash URL of the application. They are always activated by the framework and are defined in the index.js module. They require a HTML element to be loaded into, typically a DIV.

>##### Defining A Main View

A main view requires the following assignments to complete assignment:

Type | Description
------------ | -------------
HTML Element | An instance of an HTML element the view will be loaded into. This can be from the index view or a layout view.
HTML URL Assignable | An URL assignable pointing to the HTML file of the view.
JS URL Assignable | An URL assignable pointing to the JavaScript file of the view.
Route Assignable | A route to specify what hash URL should activate the view.
Function | A function that should return a boolean to indicate if a user can access the view or not.

To define a view:

```javascript
//===================================================================
//home.js
//===================================================================
import { willCore, url, route } from "./willCore/WillCore.js";

willCore.homePage = [
    willCore.$containerElement, //the view will load into element on the index.html page with ID containerElement
    url, "/homepage.js", //URL of the view's JavaScript module
    url, "/homepage.html", //URL of the view's HMTL file.
    route, "/home", //The view will activate when a hash URL "#/home" is detected.
    x => true //The view can always be accessed
    ];

//Navigate to the #/home hash URL and load the view.
willCore("/home");
```

<br/>

>#### A View's HTML File

Since a view always load into a container element on a layout page or index page, it should be thought of as a component rather than a HTML page. It should never contain any html,body or head tags.

>#### The View Module

The view module should export a function called "view". This function will be executed once the view is activated by the router.

**A view can be created via the CLI's template engine by just creating a HTML file (example: home.html).**

>### 5) View Layouts

By default views are appended to a HTML element in index.html file. There are cases where more complicated or different layouts for views are needed. For example, a login page has no navigation bar, but a home page might have. This is where layouts come in.

Unlike main views, layout views are not appended to HTML elements. They are instead appended to the body of the HTML document defined in the index.html file. When a layout is assigned to a view, it will be activated when the router activates the view using the layout.

Unlike the default index.html layout, layouts supports all the functionality normal views support like model binding and events.

Type | Description
------------ | -------------
layout Assignable | The layout module exported from the main willCore.js module.
String | An string URL pointing to the HTML file of the layout view.
String | An string URL pointing to the JavaScript file of the layout view.

<br/>

To define a layout:


```javascript
//===================================================================
//index.js
//===================================================================

import { willCore, url, route, layout } from "./willCore/WillCore.js";
//register view layout
willCore.homeLayout = [layout, "/myLayout.js", "/myLayout.html"];
//register a main view that uses the layout
willCore.homePage = [willCore.homeLayout.$mainContentDiv, url, "/homepage.js", url, "/homepage.html", route, "/home", x => true, willCore.homeLayout];
```

<br/>

The layout view files:

```html
<!--- myLayout.html --->
<div class="row view-container" id="mainContentDiv">
</div>
```

<br/>

```javascript
//===================================================================
//myLayout.js
//===================================================================

var view = async (view) => {

};

export { view };
```

**A layout view can be created via the CLI's template engine by just creating a HTML file with a name starting with an underscore (example: _layout.html).**

<br/>

>### 6) Collections And Model Binding

WillCore.UI supports model binding between HTML elements and JavaScript state. A proxy engine is used instead of observables and instead of a virtual DOM, the DOM is accessed directly via HTML IDs. The lack of all this unnecessary complexity makes WillCore.UI fast, very fast.

Every HTML file's HTML elements can only be accessed it's module. HTML IDs are unique for every HTML file, so even if the layout of a view and the view have a elements with the same ID, they won't clash. However, WillCore.UI will output an error if two elements with the same ID are detected in the same HTML file.

In order to bind an element to a JavaScript variable, that variable should be on a collection. A collection is a proxy object that lives on an instance of a view. To bind an element's (with ID nameLabel) inner HTML to a string:

```javascript
var view = async (view) => {
    //Create an collection with a bindable field.
    view.someCollection = { userName : "John Doe" };
    //Bind the inner HTML of the element to the field on the collection
    view.$nameLabel.innerHTML = () => view.someCollection.userName;
};

export { view };
```

<br/>

>**Collections should always be objects or arrays.** Fields can be functions that return values:

```javascript
const firstName = "John";
const lastName = "Doe";

var view = async (view) => {
    //Create an collection with a function.
    view.someCollection = { userName : ()=> `${firstName} ${lastName}` };
    //Bind the inner HTML of the element to the field on the collection
    view.$nameLabel.innerHTML = () => view.someCollection.userName;
};

export { view };
```

<br/>

___
>**___Binding To Conditional Results___**
>
>WillCore.UI bindings work by indexing collections to the binding functions. When a value changes on a collection, the framework knows exactly what HTML elements to update. When a binding is defined, all collections on the view are instructed to "start listening". The binding function is executed and the collections will then report when values are accessed on them. When the values are accessed the binding is indexed. This can cause some issues 
>when conditional results are returned from the function. 
>
>Take a look at this statement **() => view.someCollection.isLoggedIn || view.someCollection.user ? "Hello" : "Bey";**. When isLoggedIn is true, only loggedInMessage will be accessed from the collection, so the binding will only be keyed on one key while there should be two. So the binding will only update when isLoggedIn changes and will ignore changes in the user field. They way to get around this limitation, is to use default parameters:
>
>**(isLoggedIn = view.someCollection.isLoggedIn, user = view.someCollection.user) => isLoggedIn || user ? "Hello" : "Bey";**

___

<br/>

___
>#### Different Bindings
___

>##### Model

The model binding is an unique binding in the sense that it provides bi-directional model binding. An example of bi-directional model binding is when a string field is binded to an input. The property changes when the value of the input changes, and the input changes when the property changes. The input's value will always be the same as the property.

_A model binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
model (assignable) | The model assignable exported from the main willCore module. This can be used via single assignment, array assignment or dot notation.
function | The binding function that should return the value of the property or properties the binding is binded to.

_Using the model binding:_
```javascript
view.$elementId.model = () => view.someCollection.someProperty;
```

<br/>


>##### Inner HTML

The innerHTML binding binds an element's inner HTML to a field or function result. It a one way binding.

_An innerHTML binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
innerHTML (assignable) | The innerHTML assignable exported from the main willCore module. This can be used via single assignment, array assignment or dot notation.
function | The binding function that should return the value of the property or properties the binding is binded to.

_Using the model binding:_
```javascript
view.$elementId.innerHTML = () => view.someCollection.someProperty;
```

<br/>


>##### Repeat

The repeat binding binds an element to an array. The element with it's children will be duplicated for every item in the array. An iterator function can be used to bind the children of the element. A temporary proxy is passed to the iterator function that can be used for the binding of the child elements.

_A repeat binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
repeat (assignable) | The repeat assignable exported from the main willCore module. This can be used via single assignment, array assignment or dot notation.
function | The binding function that should return the value of the property or properties the binding is binded to.

The repeat function takes 2 parameters:

Parameter | Description
------------ | -------------
elements |  A proxy instance that can be used to access the current instance of the repeated HTML element's child elements. Can be used the same way as a view, but no collections can be defined on it.
row | As the iterator loops through the array, the row parameter will be the current item in the array.

_HTML_
```html
<div id="categoryCard">
    <h3 id="title"></h3>
    <div id="desctiption"></div>
    <hr />
    <button id="editCategory">Edit</button>
</div>
```
_Using the model binding:_
```javascript
//An array collection
view.categories = [
    {id: 1, name: "First Category", description: "Since it is the first category, it is the best."},
    {id: 2, name: "Second Category", description: "This category is last. It sucks."}
;
//Define the repeat binding.
view.$categoryCard.repeat = () => view.categories;
//Initiate the repeat binding
 view.$categoryCard.repeat((elements, row) => {
        elements.$title.innerHTML = () => row.name;
        elements.$desctiption.innerHTML = () => row.description;
        elements.$editCategory.event.onclick = () => {
            alert(`Item with ID ${row.id} clicked!`);
        };
    });
```

<br/>

___
>#### **Important!**
>Array's size and order is immutable in willCore. Meaning it can not be changed.In order to sort an array collection, first make a shallow copy of the array, sort the copy of the array and then overwrite the collection with the instance of the array. Same goes for adding new items in an array collection.
___


>##### Events

HTML events are all handled via the event assignable. The events have the same name than in vanilla JavaScript. For example, onclick.

_An even binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
event (assignable) | The event assignable exported from the main willCore module. This can be used via single assignment, array assignment or dot notation.
string | The event name. For a list of events, see JavaScript HTML events by means of using Google.
function | The function will be executed when the event is detected.

_Using the model binding:_
```javascript
view.$elementId.event.onclick = () => alert("The item was clicked!");
```

<br/>

>##### Attributes

All attributes on a HTML element can be binded to values. Attribute bindings like, style, class, href, disabled etc. are all supported

_An even binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
attribute (assignable) | The attribute assignable exported from the main willCore module. This can be used via single assignment, array assignment or dot notation.
string | The attribute name.
function | The binding function used to get the values of the attribute. Depending on the attribute, this can either return a bool, string or object.

_Using the attribute binding to bind a disabled state:_
```javascript
view.$elementId.attribute.disabled = () => view.userData.isLoggedIn;
```

<br/>

_Using the attribute binding to bind a CSS classes:_
```javascript
view.$elementId.attribute.class = () => ({ "loggedIn": () => view.userData.isLoggedIn, "loggedOut": () => !view.userData.isLoggedIn });
```

<br/>

_Using the attribute binding to bind a CSS styles:_
```javascript
view.$elementId.attribute.style = () => ({ "display": () => view.userData.isLoggedIn ? "block" : "none" });
```

<br/>

>##### Partial Views

Views can be loaded into a view as child or partial views. Partial views do not have to be declared in the index.js module. Collections can be assigned to a partial view from the parent view. After a partial view is loaded, it's collections can be accessed on the element that it has been assigned to.

_An partial view binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
event (assignable) | The event assignable exported from the main willCore module. This can be used via single assignment, array assignment or dot notation.
string | The event name. For a list of events, see JavaScript HTML events by means of using Google.
function | The function will be executed when the event is detected.

_Using the model binding:_
```javascript
view.$viewDiv = [
partial, 
"/confirm.html", //the HTML file for the view
"/confirm.js",  //the JS module of the view
{//Properties on this object will be transfered to the partial view creating a collection for each. 
    //This example will create a "info" collection in the partial.
   info: { heading: "Please Confirm", message: "Are you sure you want to delete the category?", show: false }
}];
//After the view has been loaded, we can change the collections of the partial from the parent view
view.$modal.info.show = true;
```

<br/>

>#### 7) HTTP(s) requests

Willcore.UI has built in support for HTTP(s) requests. PUT,POST,GETP,PATCH and DELETE verbs are supported. Request results are always loaded into collections. When a request is executed, the result will be a promise, so the collection will have to be awaited before the result can be accessed.

**SINCE REQUESTS ARE ASSIGNED TO COLLECTIONS AND NOT ELEMENTS, DOT NOTATION CAN __NOT__ BE USED FOR REQUESTS**

_A request need the following assignments to complete assignment:_

Type | Description
------------ | -------------
request (assignable) | The event assignable exported from the main willCore module. This can be used via single assignment, array assignment or dot notation.
string | The HTTP verb, can be: PUT,POST,GETP,PATCH or DELETE 
string | The target URL of the requests. *This needs to be a absolute URL since WillCore.UI is using the fetch API.*
object | The request data. Fields of simple type will be query parameters while objects will be the body of the request.
object | Request headers.

_Making A HTTP Request:_
```javascript
//A GET request with a URL parameter
var id = 5;
view.category = [request, "GET", `${window.location.origin}/api/Category/{id}`, {}, {}];
await view.category; //the result must be awaited before used, turning the promise into an actual result.
alert(`The category name that is returned from the server is ${view.category.name}`);

//A GET request with a query parameter
view.category = [request, "GET", `${window.location.origin}/api/Category/`, {id: id}, {}];
await view.category; //the result must be awaited before used, turning the promise into an actual result.

//A PUT request with a query parameter and body. 
view.requestResult = [request, "PUT", `${window.location.origin}/api/Category/`, {id: id, body:{bodyValue: 2, bodyValueB: 3}}, {}];
await view.requestResult; //the result must be awaited before used, turning the promise into an actual result.
alert(`The result returned from the server is ${view.requestResult}`);
```

<br/>

>### 8) Collection Targets And Sources

Collections can have targets and sources. A source is a function that will populate the collection, and a target is a function that will be executed when the collection changes. Collection sources are executed manually (by running a function with the same name as the collection, but with a leading underscore) and targets are fired by the framework. They are defined the same way, the only difference is target functions have parameters and sources don't.

More than one source and target can be defined on a collection. When a source returns undefined, the next source will be executed.

Defining sources and targets:

```javascript
//Define a source for the categories collection:
view.categories = () => [request, "GET", window.location.origin + "/api/Category", {}, {}];
//Populating the collection from the source (note the underscore):
view._categories();

//Define a target for the categories collection that will save the collection to localStorage when any value in the collection changes:
view.categories = (target, property, value) => {
        localStorage.setItem("categories", JSON.stringify(value));
    }
```

<br/>

The idea behind targets and collections are to provide easier implementation of off-line functionality in PWAs. Let's say you have a collection, userData, and this collection is loaded from the localStorage when a user is logged in, but from the server when a user is logged out. In this case you can:

* Setup a source that returns the data from localStorage if found and undefined when the data is not found.
* setup a source that returns the data from the server.
* Setup a target that targets the localStorage.

By setting the targets and collections up in this way, the initial source will try and get the data from the localStorage, if it is found, the collection will be populated from localStorage. If it is not found, the collection will be populated from the server via the HTTP request. When the target picks up the collection changed, it will automatically persist the data from the server to the localStorage of the browser.

>### 9) Routing

All views are activated via URL change events. A main view has to be defined with a URL that activates the view. Parameters can be passed to the view via the hash URL. 

To define a view's activation URL:

```javascript
//Defining a view with an activation URL
willCore.viewName = [willCore.viewId, url, "/view.js", url, "/view.html", route, "/someview" /*The activation route for the view*/ , x => true];
```

<br/>

The view will be activated when the application navigates to "#!/someview". This can be either via a link or by calling willCore("/someView");

>#### Parameters

Parameters can be passed via the URL:
_#!/someview?parameterName=parameterValue_

Parameters and their values can be accessed in the view via the route collection:

```javascript
let parameterValue = view.route.parameterName;
```

<br/>

When you have a navigation bar in a layout, bindings can be assigned to the route collection in order to highlight links to indicate the current active page.

```javascript
view.$allCategories.attribute.class = () => ({ active: view.route.url === "/categories" });
view.$addCategory.attribute.class = () => ({ active: view.route.url === "/addcategory" });
view.$info.attribute.class = () => ({ active: view.route.url === "/info" });
```

<br/>

>### 10) Runtime Creation Of HTML DOM Elements

Child DOM elements can easily be created via the create assignable. This is handy when a DOM structure is of a dynamic nature and can't be defined in a HTML template. The element type is the same as the node name of the element when it is created via "document.createElement". An unique ID has be provided.

Type | Description
------------ | -------------
create (assignable) | The create assignable exported from the main willCore module. This can be used via single assignment, array assignment or dot notation.
string | The node type. This is the same as the node name of the element when it is created via "document.createElement"
object | An object containing all the default attribute values. This values will be directly assigned to the element. For example: { class: "classA classB", style: "border:0px" }

_Using the create assignable to create DOM elements:_
```javascript
//Import the create assignable
import { create } from "../../willCore/WillCore.js";
var bindings = async (view) => {
    //create a child element of type "span" on element buttonDiv with classes "alert alert-info"
    view.$buttonDiv.$newElement.create.span = {class:"alert alert-info"};
    //Binds the inner HTML of the newly created element to the email field
    view.$newElement.innerHTML = () => view.userDetailCollection.email;
};

export { bindings };
```

<br/>

Elements can be created in loops as long as every element has a unique ID per view.

>#### Deleting of elements

Elements with all their bindings can be deleted from the document and the binding engine. The delete statement should be used. Never delete elements directly from the DOM since their bindings will still exist.


```javascript
    //Deleting an element from the DOM and removing all it's bindings:
    delete view.$newElementId;
```