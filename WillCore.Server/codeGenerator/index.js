import { willCore} from "/willcore/WillCore.js";


willCore.login = [willCore.$loginViewContainer, willCoreModules.url, "/codeGen/views/login/login.js", willCoreModules.url, "/codeGen/views/login/login.html", willCoreModules.route, "/", x => true];
willCore.initProject = [willCore.$loginViewContainer, willCoreModules.url, "/codeGen/views/initProject/view.js", willCoreModules.url, "/codeGen/views/initProject/view.html", willCoreModules.route, "/initProject", x => willCoreModules.authenticated()];
willCore.fileExplorerLayout = [willCoreModules.layout, "/codeGen/layouts/fileExplorerLayout/_fileExplorerLayout.js", "/codeGen/layouts/fileExplorerLayout/_fileExplorerLayout.html"];
willCore.folderExplorer = [willCore.fileExplorerLayout.$mainViewContainer, willCoreModules.url, "/codeGen/views/folderExplorer/folderExplorer.js", willCoreModules.url, "/codeGen/views/folderExplorer/folderExplorer.html", willCoreModules.route, "/folderExplorer", x => willCoreModules.authenticated(), willCore.fileExplorerLayout];

willCore.editorLayout = [willCoreModules.layout, "/codeGen/layouts/editorLayout/editorLayout.js", "/codeGen/layouts/editorLayout/editorLayout.html"];
willCore.editor = [willCore.editorLayout.$mainViewContainer, willCoreModules.url, "/codeGen/views/editor/editor.js", willCoreModules.url, "/codeGen/views/editor/editor.html", willCoreModules.route, "/editor", x => willCoreModules.authenticated(), willCore.editorLayout];


//willCore.codeGen = [willCore.$mainContentDiv, willCoreModules.url, "/views/codeGen.js", willCoreModules.url, "/views/codeGen.html", route,"/", x=>true];

willCoreModules.authentication().then((data) => {
    willCore(data.authenticated ? "/initProject" : "/");
});

