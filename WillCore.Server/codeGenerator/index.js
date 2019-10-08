import { willCore, url, route, layout, authentication, authenticated} from "/willcore/WillCore.js";


willCore.login = [willCore.$loginViewContainer, url, "/codeGen/views/login/login.js", url, "/codeGen/views/login/login.html", route, "/", x => true];
willCore.initProject = [willCore.$loginViewContainer, url, "/codeGen/views/initProject/view.js", url, "/codeGen/views/initProject/view.html", route, "/initProject", x => authenticated()];
willCore.folderExplorer = [willCore.$loginViewContainer, url, "/codeGen/views/folderExplorer/folderExplorer.js", url, "/codeGen/views/folderExplorer/folderExplorer.html", route, "/folderExplorer", x => authenticated()];

//willCore.codeGen = [willCore.$mainContentDiv, url, "/views/codeGen.js", url, "/views/codeGen.html", route,"/", x=>true];

authentication().then((data) => {
    willCore(data.authenticated ? "/initProject" : "/");
});
