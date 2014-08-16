var should = require("chai").should();
var System = require("../ecs/system/system");
var Exception = require("../Exception");

describe("System", function() {
    describe("#constructor()", function() {
        it("should create a new system object", function() {
            var Position = 3, Velocity = 2;
            var Physics = System("Physics", [Position, Velocity], function(aspects, dt) {
                
            });
            Physics.systemName().should.equal("Physics");
            Physics.getAspect().should.include(Position);
            Physics.getAspect().should.include(Velocity);
            should.not.throw(function() {Physics.tick();}, Exception);
        });
    });
});