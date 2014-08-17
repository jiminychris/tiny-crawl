var Component = require("./component");

var Velocity = Component("Velocity", function() {
    this._dx = 0;
    this._dy = 0;
});

Velocity.prototype.dx = function() {
    if (arguments.length === 0)
        return this._dx;
    this._dx = arguments[0];
};

Velocity.prototype.dy = function() {
    if (arguments.length === 0)
        return this._dy;
    this._dy = arguments[0];
};

module.exports = Velocity;
