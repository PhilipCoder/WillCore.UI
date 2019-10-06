import { assignable } from "../binding/assignable.js";

class route extends assignable {
    constructor() {
        super({ string: 1,function:1 });
        this.route = route;
        this.validationFunc = null;
        super.topInstance = this;
    }

    setValues(values) {
        if (values.string) {
            this.route = values.string[0];
        }
        if (values.function) {
            this.validationFunc = values.function[0];
        }
    }

    static getInstanceFactory(target, property) {
        var newRoute = new route();
        newRoute.view = target[property];
        newRoute.assignmentCompletionEvent = data => {
            newRoute.view.viewManager.setRoute(data, newRoute.view);
            target[property] = newRoute.view;
        };
        return newRoute;
    }
};
assignable.registerBindable("route", route);

var routeInstance = new route();
export { route, routeInstance };