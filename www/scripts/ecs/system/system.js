function System(systemName, aspect, tick) {
    var system = {};
    system.systemName = function() {
        return systemName;
    };
    system.aspect = function() {
        return aspect;
    };
    system.tick = tick;
    return system;
}

module.exports = System;