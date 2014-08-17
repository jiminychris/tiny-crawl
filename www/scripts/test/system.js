var should = require("chai").should();
var System = require("../ecs/system/system");
var Exception = require("../Exception");

describe("#System", function() {
    it("should create a new system object", function() {
        var Position = 3, Velocity = 2;
        var Physics = System("Physics", [Position, Velocity], function(world, aspects, dt) {
            
        });
        Physics.systemName().should.equal("Physics");
        Physics.aspect().should.have.length(2);
        Physics.aspect().should.include(Position);
        Physics.aspect().should.include(Velocity);
        should.not.throw(function() {Physics.tick();}, Exception);
    });
});