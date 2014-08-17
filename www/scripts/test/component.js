var should = require("chai").should();
var Component = require("../ecs/component/component");

describe("#Component", function() {
    it("should create a new component type", function() {
        var Position = Component("Position", function(x, y) {
            this.x = x;
            this.y = y;
        });
        var position = new Position(2, 3);
        position.x.should.equal(2);
        position.y.should.equal(3);
    });
    it("should add necessary 'class variables'", function() {
        var Position = Component("Position", function(x, y) {
            this.x = x;
            this.y = y;
        });
        var position = new Position(2, 3);
        position.constructor.componentName().should.equal("Position");
    });
});