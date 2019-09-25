import { willCore, url, route } from "./willCore/WillCore.js";
//Define the home page view. The view should load into the div with ID "mainContentDiv", load when the route is "/" and users should always have access to it.
willCore.loginPage = [willCore.$mainContentDiv, url, "/home.js", url, "/home.html", route, "/", x => true];
//Navigate to the home page
willCore("/");