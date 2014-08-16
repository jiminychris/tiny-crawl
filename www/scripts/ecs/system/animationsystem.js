var System = require("./system");
var Animation = require("../component/animaiton");
var Renderable = require("../component/renderable");
var _ = require("underscore");

var AnimationSystem = System("AnimationSystem", [Animation, Renderable], function(aspects, dt) {
    _.each(aspects, function(aspect) {
        var animation = aspect(Animation);
        var renderable = aspect(Renderable);

        var frameCount = animation.frames().length;
        var maxTime = animation.spf() * frameCount;
        var timer = animation.timer() + dt;
        if (timer >= maxTime)
            timer -= maxTime;
        animation.timer(timer);
        var frameIndex = Math.floor(timer / animation.spf());
        var frame = animation.frames()[frameIndex];

        renderable.image(frame);
    });
});

module.exports = AnimationSystem;
