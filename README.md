<p align="center">
<img src="res/WillCoreLogo.png"  />
<h1 align="center">WillCore.UI</h1>
<h5 align="center">Simple, Fast And Powerfull Client-Side HTML UI Framework - By Philip Schoeman</h5>
<h5 align="center" style="color:red">DOCUMENTATION IS A WORK IN  PROGRESS.</h5>
</p>

___

> WillCore.UI is a framework that makes building a client-side rendered single paged application easy. Fast and small, but yet powerful, it requires no pre-compilers and everything is coded in ES6. WillCore.UI is an extension on the WillCore.Server framework.

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

E3) Dot notation can be used on the assignable and string fields:

```javascript
view.$elementId.attribute.style = () => ({ color: "red" });
```
<br/>

Examples 2 and 3 do the same thing. Assignables are the core of WillCore.UI's API and all interaction with the framework is done via assignables.

___
> ### 2) Getting Started
___

WillCore.UI can be installed via an NPM package. Make a new directory and install the module into the directory:

```javascript
npm install willcore.ui
```

WillCore.UI is an extension on WillCore.Server. For documentation on WillCore.Server see the [github repo](https://github.com/PhilipCoder/willcore.server).

#### To create a server

The basic folder structure of a WillCore.UI project:

```text
|─── Project Directory
|    |─── client
|         |─── app.js
|         |─── index.js
|         |─── index.html
|    |─── services
|─── server.js
```

#### Create a server.js file in the project root directory:

```javascript
//server.js
//Import the WillCore Proxy.
const willCoreProxy = require("willcore.core");
//Create a new proxy instance.
let core = willCoreProxy.new()
//Create an http server on port 8580 executing in the client directory;
core.testServer.server[`${__dirname}/client`] = 8580;
core.testServer.http;
//Load the UI framework.
core.testServer.ui;
```

#### Create an app.js client-side entry point:

The app.js module should export an function named init. This function will execute when the client side app loads.

```javascript
let init = (willcore) => {
    //Loads the client side library
    willcore.ui;
};
//Export the function using ES6 export
export { init };
```

#### Create an index.html file in the client folder:

```html
<h1 id="heading"></h1>
```

#### Create an index.js file in the client folder:

```javascript
//The view function
let view = async (model) => {
    //Create a data collection called data
    model.data = { toBind: "Hello World" };
    //Binds the heading to the "toBind" property on the data set
    model.$heading.bind = () => model.data.toBind;
};
//Exports the view function
export {view};
```
___
>## 3) Views And Routing.
___

WillCore.UI views are rendered into a built up HTML document and consists of a JavaScript module and HTML file. The HTML file and JavaScript files should have the same name, only the extensions differ. For instance a view "home" should have a "home.js" and "home.html" file in the same directory.

>### 3.1) The HTML file

The HTML file excludes the HTML page, header and body tags. All elements that are accessed through JavaScript should have IDs.

#### Example of a "Hello World" view file

```html
<label>Hello World</label>
```

>### 3.2) The view module.

The view module is file that exports a function named "view". The first parameter of the view function is the view model. This function will be executed when the view is activated and loaded.

```javascript
//The view function
let view = async (model) => {
};
//Exports the view function
export {view};
```

>### 3.3) Routing


Routing is done via the hash URL of the site. By default the home hash route "/" will load the index view in the root directory. To load a view about in the root directory the hash URL will be '/about'. Views can be multiple directories deep. For instance to load a view named register in the /views/account folder, the URL will be "/views/account/register". Views will load when the hash URL changes. 

Views can have parameters in their hash URLs. "/account?id=90&action=delete" will have two parameters id with value 90 and action with value "delete". View parameters can be accessed via the location assignable on the model.

#### Accessing view parameters

```javascript
//The view function
let view = async (model) => {
    //Alert the view parameters
    alert(`The id parameter is ${model.location.id} and the action parameter is ${model.location.action}.`);
};
//Exports the view function
export {view};
```

The hash URL can be set via the navigate function on the location assignable. The first parameter is the view location and the second parameter is the view parameters.

#### To navigate to "/account/manage?id=90&action=delete"

```javascript
//The view function
let view = async (model) => {
    //Navigate to the manage account view.
    model.location.navigate("/account/manage",{id:90, action:"delete"});
};
//Exports the view function
export {view};
```

>### 5) View Layouts

By default views are appended to the body of the HTML page. There are cases where more complicated or different layouts for views are needed. For example, a login page has no navigation bar, but a home page might have. This is where layouts come in.

 When a layout is assigned to a view, it will be activated when the router activates the view using the layout.

Unlike the default index.html layout, layouts supports all the functionality normal views support like model binding and events.

When a view module also export an container ID, the view module will be treated as a layout view. The containerId is the element ID the layout's child view will be rendered into.

<br/>

#### To define a layout:


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

#### The layout view files (layoutView.html):

```html
<div style="display: flex;flex-direction: column;flex: 1;">
    <div style="display: flex;flex-direction: column;flex: 1;">
        <h1>Layout View</h1>
    </div>
    <div style="display: flex;flex-direction: column;flex: 1;" id="container">
    </div>
</div>
```

<br/>

#### (layoutView.js)

```javascript
let view = async (model) => {
};

let containerId = "container";

export {view, containerId};
```

**A layout view can be created via the CLI's template engine by just creating a HTML file with a name starting with an underscore (example: _layout.html).**

<br/>

#### Rendering a view in a layout

```javascript
let view = async (model) => {
};


let layout = "/layoutFolder/layoutView"

export { view, layout };
```

<br/>

___
>## 4) Data Proxies
___

Data proxies are objects that triggers events when data on them changes. They are the core of the model-binding functionality of WillCore.UI. To create a data proxy, simply assign an object or array containing the data to a property on a view's model. All objects and arrays will be converted into data proxies. Data proxies can be multi-layer deep and when an object is assigned to a data proxy as a child, it will also be converted into a data proxy.

```javascript
//The view function
let view = async (model) => {
    //Create a data proxy called data
    model.personData = { 
        firstName: "John", 
        surname:"Doe", 
        telephone: 
            {
                areaCode:"0026", 
                number:"6547833"
            }
        };
};
//Exports the view function
export {view};
```

___
>## 5) Data Bindings
___

WillCore.UI supports model binding between HTML elements and JavaScript state. A proxy engine is used instead of observables and instead of a virtual DOM, the DOM is accessed directly via HTML IDs. The lack of all this unnecessary complexity makes WillCore.UI fast, very fast.

Every HTML file's HTML elements can only be accessed by it's module. HTML IDs are unique for every HTML file, so even if the layout of a view and the view have a elements with the same ID, they won't clash. However, WillCore.UI will output an error if two elements with the same ID are detected in the same HTML file.

In order to bind an element to a JavaScript variable, that variable should be on a data proxy. To bind an element's (with ID nameLabel) inner HTML to a string:

```javascript
var view = async (view) => {
    //Create an collection with a bindable field.
    view.userData = { userName : "John Doe" };
    //Bind the inner HTML of the element to the field on the collection
    view.$nameLabel.bind = () => view.userData.userName;
};

export { view };
```

___
>**___Binding To Conditional Results___**
>
>WillCore.UI bindings work by indexing data proxies to the binding functions. When a value changes on a data proxy, the framework knows exactly what HTML elements to update. When a binding is defined, all data proxies on the view are instructed to "start listening". The binding function is executed and the data proxies will then report when values are accessed on them. When the values are accessed the binding is indexed. This can cause some issues 
>when conditional results are returned from the function. 
>
>Take a look at this statement **() => model.someCollection.isLoggedIn || model.someCollection.user ? "Hello" : "Bey";**. When isLoggedIn is true, only loggedInMessage will be accessed from the data proxy, so the binding will only be keyed on one key while there should be two. So the binding will only update when isLoggedIn changes and will ignore changes in the user field. They way to get around this limitation, is to use default parameters:
>
>**(isLoggedIn = view.someCollection.isLoggedIn, user = view.someCollection.user) => isLoggedIn || user ? "Hello" : "Bey";**



___
>#### Different Bindings
___

>##### Model

The model binding is an unique binding in the sense that it provides bi-directional model binding. An example of bi-directional model binding is when a string field is bound to an input. The property changes when the value of the input changes, and the input changes when the property changes. The input's value will always be the same as the property.

_A model binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
model (assignable) | The model assignable exported from the main willCore module. 
function | The binding function that should return the value of the property or properties the binding is bound to.

_Using the model binding:_
```javascript
model.$elementId.model = () => model.dataProxy.someProperty;
```

<br/>


>##### Bind (InnerHTML)

The bind binding binds an element's inner HTML to a field or function result. It a one way binding.

_A bind binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
bind (assignable) | The bind assignable exported from the main willCore module. 
function | The binding function that should return the value of the property or properties the binding is bound to.

_Using the model binding:_
```javascript
model.$elementId.bind = () => model.dataProxy.someProperty;
```

<br/>


>##### Repeat

The repeat binding binds an element to an array. The element with it's children will be duplicated for every item in the array. An iterator function can be used to bind the children of the element. A temporary proxy is passed to the iterator function that can be used for the binding of the child elements.

_A repeat binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
repeat (assignable) | The repeat assignable exported from the main willCore module. 
function | The binding function that should return the value of the property or properties the binding is binded to.

The repeat function takes 2 parameters:

Parameter | Description
------------ | -------------
elements |  A proxy instance that can be used to access the current instance of the repeated HTML element's child elements. Can be used the same way as a model, but no collections can be defined on it.
index | As the iterator loops through the array, the index parameter will be the current index in the array.

_HTML_

```html
<div id="categoryCard">
    <h3 id="title"></h3>
    <div id="description"></div>
    <hr />
    <button id="editCategory">Edit</button>
</div>
```

_Using the model binding:_

```javascript
//An array collection
model.categories = [
    {id: 1, name: "First Category", description: "Since it is the first category, it is the best."},
    {id: 2, name: "Second Category", description: "This category is last. It sucks."}
;
//Define the repeat binding.
model.$categoryCard.repeat = () => model.categories;
//Initiate the repeat binding
 model.$categoryCard.repeat = (elements, rowIndex) => {
        elements.$title.innerHTML = () => model.categories[rowIndex].name;
        elements.$description.innerHTML = () => model.categories[rowIndex].description;
        elements.$editCategory.event.onclick = () => {
            alert(`Item with ID ${model.categories[rowIndex].id} clicked!`);
        };
    );
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
string | The event name. For a list of events, see JavaScript HTML events by means of using Google.
event (assignable) | The event assignable exported from the main willCore module. 
function | The function will be executed when the event is detected.

_Using the model binding:_
```javascript
model.$elementId.onclick.event= () => alert("The item was clicked!");
```

<br/>

>##### Attributes

All attributes on a HTML element can be binded to values. Attribute bindings like, class, href, disabled etc. are all supported

_An attribute binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The attribute name.
attribute (assignable) | The attribute assignable exported from the main willCore module. 
function | The binding function used to get the values of the attribute. The function should return a string value that will be applied to the attribute.

_Using the attribute binding to bind a disabled state:_
```javascript
model.$elementId.disabled.attribute = () => model.userData.isLoggedIn;
```

<br/>

>##### Select Options

The options in a select dropdown can be bound to a data proxy with the options binding. The data proxy values can be either an object or multidimensional array.

_A options binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
options (assignable) | The options assignable exported from the main willCore module. 
function | The function that can return either an object or multi dimensional array.

_Using the options binding to bind to an object:_

When binding to an object, the property name will translate into the label of the option and the value of the property will result in the value of the option.

```javascript
model.myData = {genders: { Male: "male", Female: "female" }};
model.$dropdown.options = () => model.myData.genders;
```

_Using the options binding to bind to a multidimensional array:_

When binding to an array of arrays, the second item will translate into the label of the option and the first item will result in the value of the option.

```javascript
model.myData = {genders: [["Male", "male"], ["Female", "female" ]]};
model.$dropdown.options = () => model.myData.genders;
```

_Using the options binding with the model binding:_

The options binding can be used with the model binding to bind the selected option to a value on a value proxy.

```javascript
model.myData = {
        genders: [["Male", "male"], ["Female", "female" ]],  
        gender: null
    };
model.$dropdown.options = () => model.myData.genders;
model.$dropdown.model = () => model.myData.gender;
```

<br/>

>##### Disabled

The disabled binding binds an element's disabled attribute to a field or function result. It a one way binding.

_A disabled binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
disabled (assignable) | The disabled assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to. The result should translate to true or false.

_Using the model binding:_
```javascript
model.$submitButton.disabled = () => model.myData.name.length > 10;
```

<br/>

>##### Hide

The hide binding binds an element's hidden status to a field or function result. It a one way binding.

_A hide binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
hide (assignable) | The hide assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to. The result should translate to true or false.

_Using the model binding:_
```javascript
model.$submitButton.hide = () => model.myData.name.length > 10;
```
<br/>

>##### Show

The show binding binds an element's hidden status to a field or function result. It a one way binding.

_A show binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
show (assignable) | The show assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to. The result should translate to true or false.

_Using the model binding:_
```javascript
model.$submitButton.show = () => model.myData.name.length > 10;
```

<br/>

>##### Style

The style binding binds an element's css style to a field or function result. It a one way binding.

_A style binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The css style to be bound.
style (assignable) | The style assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to.

_Using the style binding:_
```javascript
model.$dropdown.backgroundColor.style = () => model.myData.gender === "male" ? "lightblue" :"pink";
```

<br/>

>##### Class

The class binding binds an element's css class to a field or function result. It a one way binding.

_A style binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The css class to be bound.
class (assignable) | The class assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to. The result should translate to true or false.

_Using the style binding:_
```javascript
model.$nameInput.invalid.class = () => model.myData.name.length === 0;
```

<br/>

>##### Partial Views

Views can be loaded into a view as child or partial views. Data proxies can be assigned to a partial view from the parent view. After a partial view is loaded, it's model can be accessed via the callback function.

_An partial view binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
view (assignable) | The view assignable.
string | Path to the view.
function | Callback for when the partial view is done loading. It takes one parameter that will be the model of the partial view.

_Using the model binding:_
```javascript
model.$partialDiv.view = "/zView/partial";
//Callback for when the view is done loading
model.$partialDiv.view = (clientModel) => {
    //Changes a property on a data proxy inside the child partial view.
    window.setTimeout(() => {
        clientModel.data.value = "5 Seconds Passed.";
    }, 5000);
};
```

<br/>

>## 5) Adding CSS and JavaScript to the HTML document.

WillCore.UI builds up the HTML header tag, so it is not possible to include HTML and CSS files directly in the HTML. The header is built using the script and style cache in the server-side assignable.

>#### 5.1) Adding A CSS Style File To The Page

A style file can be assigned to the server via the style assignable.

_A style assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The name of the file.
style (assignable) | The style assignable.
string | The file's path relative to the server's executing directory.

```javascript
//Create the server
const willCoreProxy = require("willcore.core");
let core = willCoreProxy.new();
core.testServer.server[__dirname] = 8580;
core.testServer.http;
core.testServer.ui;
//Add a CSS style file to the server
core.testServer.bootstrapStyle.scriptModule = "/css/BootStrap.css;
```

>#### 5.2) Adding A JavaScript File To The Page

A script file can be assigned to the server via the script assignable.

_A script assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The name of the file.
script (assignable) | The script assignable.
string | The file's path relative to the server's executing directory.

```javascript
//Create the server
const willCoreProxy = require("willcore.core");
let core = willCoreProxy.new();
core.testServer.server[__dirname] = 8580;
core.testServer.http;
core.testServer.ui;
//Add a JavaScript file to the server
core.testServer.bootstrapScript.script = "/libraries/BootStrap.js";
```

>#### 5.3) Adding A JavaScript Module File To The Page

A script file of type "module" can be assigned to the server via the script assignable.

_A scriptModule assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The name of the file.
scriptModule (assignable) | The scriptModule assignable.
string | The file's path relative to the server's executing directory.

```javascript
//Create the server
const willCoreProxy = require("willcore.core");
let core = willCoreProxy.new();
core.testServer.server[__dirname] = 8580;
core.testServer.http;
core.testServer.ui;
//Add a JavaScript file of type module to the server
core.testServer.myComponent.scriptModule = "/libraries/myComponent.js";
```

>## 6) Custom Components

Custom components in WillCore.UI combine the power of HTML web components with the easy of use proxy model binding. 