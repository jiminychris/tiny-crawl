var Component = require("./component");

var Camera = Component("Camera", function() {
    this._screen = null;
    this._zoom = 1;
    this._bounds = {};
});

Camera.prototype.screen = function() {
    if (arguments.length === 0)
        return this._screen;
    this._screen = arguments[0];
};

Camera.prototype.zoom = function() {
    if (arguments.length === 0)
        return this._zoom;
    this._zoom = arguments[0];
};

Camera.prototype.bounds = function() {
    if (arguments.length === 0)
        return this._bounds;
    this._bounds = arguments[0];
};

module.exports = Camera;
