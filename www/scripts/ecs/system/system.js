function System(systemName, aspect, tick) {
    var system = {};
    system.systemName = function() {
        return systemName;
    };
    system.getAspect = function() {
        return aspect;
    };
    system.tick = tick;
    return system;
}

module.exports = System;