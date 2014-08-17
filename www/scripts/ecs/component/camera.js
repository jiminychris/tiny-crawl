var Component = require("./component");

var Camera = Component("Camera", function() {
    this._screen = null;
    this._zoom = 1;
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

module.exports = Camera;
