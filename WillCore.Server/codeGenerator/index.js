import { willCore } from '/willcore/WillCore.js';
import { indexParser } from './parser/indexParser.js';
new indexParser('/index.js').processIndexFile().then(console.log);
willCore['bootstrap-dropdown'] = [
    willCoreModules.component,
    '/codeGen/components/bootstrap/dropdown/bootstrapDropdown.js',
    '/codeGen/components/bootstrap/dropdown/bootstrapDropdown.html',
    {}
];
willCore['editor-module-nav'] = [
    willCoreModules.component,
    '/codeGen/components/editorModuleNav/editorModuleNav.js',
    '/codeGen/components/editorModuleNav/editorModuleNav.html',
    {}
];
willCore.codeGenLogin = [
    willCore.$loginViewContainer,
    willCoreModules.url,
    '/codeGen/views/login/codeGenLogin.js',
    willCoreModules.url,
    '/codeGen/views/login/codeGenLogin.html',
    willCoreModules.route,
    '/',
    x => true
];
willCore.codeGenInitProject = [
    willCore.$loginViewContainer,
    willCoreModules.url,
    '/codeGen/views/initProject/codeGenInitProject.js',
    willCoreModules.url,
    '/codeGen/views/initProject/codeGenInitProject.html',
    willCoreModules.route,
    '/initProject',
    x => willCoreModules.authenticated()
];
willCore.fileExplorerLayout = [
    willCoreModules.layout,
    '/codeGen/layouts/fileExplorerLayout/_fileExplorerLayout.js',
    '/codeGen/layouts/fileExplorerLayout/_fileExplorerLayout.html'
];
willCore.folderExplorer = [
    willCore.fileExplorerLayout.$mainViewContainer,
    willCoreModules.url,
    '/codeGen/views/folderExplorer/folderExplorer.js',
    willCoreModules.url,
    '/codeGen/views/folderExplorer/folderExplorer.html',
    willCoreModules.route,
    '/folderExplorer',
    x => willCoreModules.authenticated(),
    willCore.fileExplorerLayout
];
willCore.editorLayout = [
    willCoreModules.layout,
    '/codeGen/layouts/editorLayout/editorLayout.js',
    '/codeGen/layouts/editorLayout/editorLayout.html'
];
willCore.codeGenEditor = [
    willCore.editorLayout.$mainViewContainer,
    willCoreModules.url,
    '/codeGen/views/editor/codeGenEditor.js',
    willCoreModules.url,
    '/codeGen/views/editor/codeGenEditor.html',
    willCoreModules.route,
    '/editor',
    x => willCoreModules.authenticated(),
    willCore.editorLayout
];
willCoreModules.server.runRequest('index/getFileEditingViews', {}).then(modules => {
    modules.fileEditors.forEach(editorView => {
        willCore[editorView.name] = [
            willCore.editorLayout.$mainViewContainer,
            willCoreModules.url,
            editorView.htmlPath,
            willCoreModules.url,
            editorView.jsPath,
            willCoreModules.route,
            editorView.config.route,
            x => willCoreModules.authenticated(),
            willCore.editorLayout
        ];
    });
    modules.editorComponents.forEach(component => {
        willCore[component.name] = [
            willCoreModules.component,
            component.jsPath,
            component.htmlPath,
            {}
        ];
    });
});
willCoreModules.authentication().then(data => {
    willCore(data.authenticated ? '/initProject' : '/');
});