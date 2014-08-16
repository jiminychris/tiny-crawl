var Component = require("./component");

var Renderable = Component("Renderable", function() {
    this._image = null;
});

Renderable.prototype.image = function() {
    if (arguments.length === 0)
        return this._image;
    this._image = arguments[0];
};

module.exports = Renderable;