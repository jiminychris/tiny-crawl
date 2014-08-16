var Component = require("./component");

var Position = Component("Position", function() {
    this._x = 0;
    this._y = 0;
});

Position.prototype.x = function() {
    if (arguments.length === 0)
        return this._x;
    this._x = arguments[0];
};

Position.prototype.y = function() {
    if (arguments.length === 0)
        return this._y;
    this._y = arguments[0];
};

module.exports = Position;
