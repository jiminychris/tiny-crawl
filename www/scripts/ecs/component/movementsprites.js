var Component = require("./component");

var MovementSprites = Component("MovementSprites", function() {
    this._left = [];
    this._right = [];
});

MovementSprites.prototype.left = function() {
    if (arguments.length === 0)
        return this._left;
    this._left = arguments[0];
};

MovementSprites.prototype.right = function() {
    if (arguments.length === 0)
        return this._right;
    this._right = arguments[0];
};

module.exports = MovementSprites;
