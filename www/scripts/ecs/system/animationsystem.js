var Animation = require("../component/animaiton");
var Position = require("../component/position");
var _ = require("underscore");

var AnimationSystem = {};
AnimationSystem.systemName = function() {
    return "SpriteAnimator";
};
AnimationSystem.getAspect = function() {
    return [Animation, Position];
};
AnimationSystem.tick = function(aspects, dt) {
    _.each(aspects, function(aspect) {
        var animation = aspect(Animation);
        var position = aspect(Position);
    });
}

module.exports = AnimationSystem;
