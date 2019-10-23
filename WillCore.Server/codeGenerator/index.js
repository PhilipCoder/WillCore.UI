import { willCore} from "/willcore/WillCore.js";


willCore.codeGenLogin = [willCore.$loginViewContainer, willCoreModules.url, "/codeGen/views/login/codeGenLogin.js", willCoreModules.url, "/codeGen/views/login/codeGenLogin.html", willCoreModules.route, "/", x => true];
willCore.codeGenInitProject = [willCore.$loginViewContainer, willCoreModules.url, "/codeGen/views/initProject/codeGenInitProject.js", willCoreModules.url, "/codeGen/views/initProject/codeGenInitProject.html", willCoreModules.route, "/initProject", x => willCoreModules.authenticated()];
willCore.fileExplorerLayout = [willCoreModules.layout, "/codeGen/layouts/fileExplorerLayout/_fileExplorerLayout.js", "/codeGen/layouts/fileExplorerLayout/_fileExplorerLayout.html"];
willCore.folderExplorer = [willCore.fileExplorerLayout.$mainViewContainer, willCoreModules.url, "/codeGen/views/folderExplorer/folderExplorer.js", willCoreModules.url, "/codeGen/views/folderExplorer/folderExplorer.html", willCoreModules.route, "/folderExplorer", x => willCoreModules.authenticated(), willCore.fileExplorerLayout];

willCore.editorLayout = [willCoreModules.layout, "/codeGen/layouts/editorLayout/editorLayout.js", "/codeGen/layouts/editorLayout/editorLayout.html"];
willCore.codeGenEditor = [willCore.editorLayout.$mainViewContainer, willCoreModules.url, "/codeGen/views/editor/codeGenEditor.js", willCoreModules.url, "/codeGen/views/editor/codeGenEditor.html", willCoreModules.route, "/editor", x => willCoreModules.authenticated(), willCore.editorLayout];


//willCore.codeGen = [willCore.$mainContentDiv, willCoreModules.url, "/views/codeGen.js", willCoreModules.url, "/views/codeGen.html", route,"/", x=>true];

willCoreModules.authentication().then((data) => {
    willCore(data.authenticated ? "/initProject" : "/");
});

