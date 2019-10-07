import { willCore, url, route, layout, authentication } from "/willcore/WillCore.js";


willCore.login = [willCore.$loginViewContainer, url, "/codeGen/views/login/login.js", url, "/codeGen/views/login/login.html", route, "/", x => true];
willCore.initProject = [willCore.$loginViewContainer, url, "/codeGen/views/initProject/view.js", url, "/codeGen/views/initProject/view.html", route, "/initProject", x => true];

//willCore.codeGen = [willCore.$mainContentDiv, url, "/views/codeGen.js", url, "/views/codeGen.html", route,"/", x=>true];
authentication().then((data) => {
    if (data.authenticated) {
        willCore("/initProject");
    } else {
        willCore("/");
    }
});
