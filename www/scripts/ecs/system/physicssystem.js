var System = require("./system");
var Position = require("../component/position");
var Velocity = require("../component/velocity");
var _ = require("underscore");

var PhysicsSystem = System("PhysicsSystem", [Position, Velocity], function(world, aspects, dt) {
    _.each(aspects, function(aspect) {
        var position = aspect(Position);
        var velocity = aspect(Velocity);
        console.log(dt);
        position.x(position.x()+velocity.dx()*dt);
        position.y(position.y()+velocity.dy()*dt);
    });
});

module.exports = PhysicsSystem;
