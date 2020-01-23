let services = {}
class BaseComponent {
    constructor(prop) {
        this.prop = prop;
        if(this.prop.expose && typeof this.prop.expose === "function") {
            this.prop.expose(this);
        }
    }

    inject(service) {
        services[service.constructor.name] = service;
    }

    require(service) {
        return services[service.name];
    }
}

export default BaseComponent;