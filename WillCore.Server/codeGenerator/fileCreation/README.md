># File Creation Plugins

Overview of how the file creation plugins work

___
>### File Locations
___


>### Default files

By default there will be an index.html and index.js file in the wwwRoot folder. This won't be an option, the files will be created by the NPM package.

>### Project Creation Files

File plugins with a menuPath (set in the plugins config.json) set to "Project/" will be shown in the Project screen. If these plugins have no static path in their 
config.json, they will require the user to add a path before they can be added. Files like these will be Bootstrap, Bootstrap themes, default CSS etc.

>### Main Creation Files

File plugins with a menuPath without a parent can't have a static path and will be available from the navigation bar in the explorer view as main menu items. Dropdowns
can be created with a pipe, for example "View Components|Binding. Examples of these plugins are Views, Layouts, Partials, Components, Tables and Queries.


___
>### Aggregation Of Files
___

Files that are aggregated in the explorer view like the files of a view, will be aggregated by linking the registered plugin files in the project.json file
to the plugin's config.json.

___
>### The create model
___

The create model is the model for the modal to create a file. This model defines the inputs that is displayed on the create modal. The model is created by
a modelFactory class in the plugin directory. A method "createModel" will be called on the factory class that will return the model. It takes two parameters
projectFile and wwwRootPath.

The model will be a ViewSON. ViewSON is JSON containing basic information to create a view.

Defining the server-side file:
```javascript
//viewModal.viewSON
let viewSON () => ({
    myCollectionA:{Name:"John", Surname:"Doe"},
    $formDiv:[create,"div",{class:"form-group"}],
    "$formDiv.$formLabel":["create","label",{class:"control-label"}],
    "$formDiv.$formControl":["create","input",{class:"control-label",type:"text"}],
    $formControl:["model",{function:true,result:"myCollection.Name"}]
});
module.export = viewSON;
```

Using ViewSON client-side:

```javascript
//viewModal.ViewSON
let view = async (view) => ({
    view.$viewJSONContainer.viewSON = "./viewModal.viewSON";
});
module.export = viewSON;
```