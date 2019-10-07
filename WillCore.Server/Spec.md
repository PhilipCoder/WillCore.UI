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

*All requests are PUT requests since complex parameters are required to populate the collections on the server.*

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
    view.userData = [server,() => [view.userInfo]];
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

The following happens when a request is made:

1. An assignable with a function that returns an array of dependent collections is used to create the server collection source.
2. When the collection source is fired, a random GUID is generated (the request ID).
3. A PUT request is fired with the with the request ID as parameter and the dependent collections as body.
4. The same time a SSE request is fired, also with the request ID as parameter.
5. A global SSE event container based on a proxy should be present. This request container is keyed by the request IDs.
6. When a collection is modified, the server-side view proxy adds the modified collection to the SSE event container. The event container proxy will then check if any SSE promises are registered on the container, if there are any, they will be resolved with the modified collections.
7. When the SSE hits the server, it will register itself on the event-container. This registration is a promise that when resolved, will return the SSE with JSON of the modified collections for the request.
8. When the promise is registered, the SSE event proxy will do the same check to see if there are modified collections and will resolve the SSE promise if any modified collections are detected. 
9. A SSE timeout should be specified in the config JSON. A timeout should be registered for the SSE that will reject the SSE promise.

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

>## Request Hub

The request hubs are server-side objects that are mirrored on the front-end. All hub properties on the hubs are lazy loaded. The request hub containers are defined in *.hub files. Request hubs are assigned to the hub containers.
Request hubs are proxies.

```javascript
//Defining a request hub:

```