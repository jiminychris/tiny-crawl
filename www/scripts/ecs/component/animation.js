var Component = require("./component");

var Animation = Component("Animation", function() {
    this.frames = [];
    this.fps = 0;
});

module.exports = Animation;