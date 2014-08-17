var Component = require("./component");

var Camera = Component("Camera", function() {
    this._width = 0;
    this._height = 0;
});

Camera.prototype.width = function() {
    if (arguments.length === 0)
        return this._width;
    this._width = arguments[0];
};

Camera.prototype.height = function() {
    if (arguments.length === 0)
        return this._height;
    this._height = arguments[0];
};

module.exports = Camera;
