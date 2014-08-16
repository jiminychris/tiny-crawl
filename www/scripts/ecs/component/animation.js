var Component = require("./component");

var Animation = Component("Animation", function() {
    this._frames = [];
    this._fps = 0;
    this._spf = 0;
    this._timer = 0;
});

Animation.prototype.frames = function() {
    if (arguments.length === 0)
        return this._frames;
    this._frames = arguments[0];
};

Animation.prototype.fps = function() {
    if (arguments.length === 0)
        return this._fps;
    this._fps = arguments[0];
    this._spf = 1 / this._fps
};

Animation.prototype.spf = function() {
    if (arguments.length === 0)
        return this._spf;
    this._spf = arguments[0];
    this._fps = 1 / this._spf
};

Animation.prototype.timer = function() {
    if (arguments.length === 0)
        return this._timer;
    this._timer = arguments[0];
};

module.exports = Animation;