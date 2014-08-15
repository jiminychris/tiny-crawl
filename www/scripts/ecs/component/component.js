function Component(componentName, constructor) {
    constructor.componentName = function() {
        return componentName;
    }
    return constructor;
}

module.exports = Component;