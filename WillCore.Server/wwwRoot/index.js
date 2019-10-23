import { willCore, url, route, layout } from "./willCore/WillCore.js";

willCore.loginLayout = [willCoreModules.layout,  "/layouts/loginLayout.js","/layouts/loginLayout.html"];
willCore.login = [willCore.$loginLayout.layoutDiv, willCoreModules.url, "/views/login.js", willCoreModules.url, "/views/login.html", willCoreModules.route, "/home", x => true, willCore.loginLayout];
//<CodeTag> - Don't remove

willCore("/");