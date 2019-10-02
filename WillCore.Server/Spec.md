># Server Side Request Framework Spec

>#### This is a spec for the up coming server-side WillCore Node framework.

>## Overview

The idea is to have a simple server-side framework for WillCore.UI. It should have the following features:

* Static file server
* Server-side collection sources.
* A basic authentication framework.

>## Static file server

A WillCore.Server project should have the following layout:

* wwwRoot  
  * view HTML and js files <br/>
* willCore <br/>
  * willCore.Server <br/>
  * willCore.UI

A configuration JSON can be setup to indicate what files will be excluded from the static file serving. Default all the files in willCore.Server and files "*.server.js" and "*.json" will be excluded.

staticFileBlackList.json:
```json
[
    {type:"directory", value:"/willCore/willcore.Server"},
    {type: "fileName", value:"*.server.js"},
    {type: "fileName", value:"*.json"}
];
```

There should be no files above the wwwRoot folder. All the framework related files should live in the willCore folder.

 <br/>

>## Server-Side Collection Sources

Server-side collection sources are used to retrieve data from the server. Server-Side collection sources are defined in a different way than client-side collection sources. Server-side collection sources are
named and can have dependent collections. Dependent collections are collections that will be send to the server and that can be accessed in the collection source on the server. All changes made to collections
in the server-side collection source will reflect in the front-end.

*All requests are POST requests since complex parameters are required to populate the collections on the server.*

Defining a server collection source:

```javascript
//login.server.js
exports.login = () =>  {
    view.userData = (view) => {
        loadFromDB(view.userInfo.userId);
    };
};
```

```javascript
//login.sources.js
var sources = async (view, configuration) => {
    view.userData = [server, [view.userInfo]];
};

export { sources };
```

```javascript
//The source can be loaded the same way as a normal collection source
var logic = (view, configuration) =>
    ({
        loadData: () => {
          view._userData();
          await view.userData();
        }
    });

export { logic };
```

 <br/>

>## Authentication Framework

A basic, in memory authentication framework will be included.

Logging a user in:

```javascript
//login.server.js
let authentication = require("authentication");

exports.server = () =>  {
    view.loginData = (view) => {
        let authenticated = view.loginData.userName === "test@gmail.com" && view.loginData.password === "mypassword" ? true : false;
        if (authenticated){
            //Calling the authentication method with a parameter will log a user in.
            authentication({userName : view.loginData.userName, moreData: "my data"});
        }
        view.authenticationResult = {success:authenticated};
    },
    view.logoutData = (view) => {
      //Calling the authentication method without a parameter will log the user out.
       authentication();
    };
};
```

Accessing the user session in the front-end:
```javascript
import { willCore, url, route, session } from "./willCore/WillCore.js";

willCore.allCategories = [willCore.$mainContentDiv, url, "/viewAll.js", url, "/viewAll.html", route, "/categories", x => session.authenticated];
//The user data object is copied to the sessions object.
console.log(session.moreData);
```

<br/>

A secret encryption key is stored in a JSON config file. This is used to hash a GUID that will be the session ID. This session ID will be submitted with every request. To validate that a user is logged in
on the server:

```javascript
//login.server.js
exports.server = () =>  {
    view.userData = (view) => {
        view.authenticated();
        loadFromDB(view.userInfo.userId);
    };
};
```

The authenticated function can be overridden to implement custom authentication, such as role based authentication.