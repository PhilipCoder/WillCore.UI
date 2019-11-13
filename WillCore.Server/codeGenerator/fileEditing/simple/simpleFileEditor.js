import PNotify from "../../libraries/pNotify/es/PNotify.js";
PNotify.defaults.styling = 'bootstrap4';

var view = async (view) => {
    view.$editor.file = view.route.route;
    view.viewData = { name: null, fileRoute: null, viewType: "view", linked: false, layout: null, route: "", layoutElement: "" };

    view.$saveFileBtn.event.onclick = async () => {
        await view.$editor.saveFile();
        PNotify.success({
            text: "File Saved.",
            type: 'notice'
        });
    };
};

export { view };


