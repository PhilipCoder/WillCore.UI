import { willCore, url, route, layout } from "/willcore/WillCore.js";


willCore.login = [willCore.$loginViewContainer, url, "/codeGen/views/login/login.js", url, "/codeGen/views/login/login.html", route,"/", x=>true];

//willCore.codeGen = [willCore.$mainContentDiv, url, "/views/codeGen.js", url, "/views/codeGen.html", route,"/", x=>true];
willCore("/");