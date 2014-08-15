var assert = require("assert");
var Component = require("../ecs/component/component");

describe("Component", function() {
    describe("#constructor()", function() {
        it("should create a new component type", function() {
            var Position = Component("Position", function(x, y) {
                this.x = x;
                this.y = y;
            });
            var position = new Position(2, 3);
            assert.strictEqual(2, position.x);
            assert.strictEqual(3, position.y);
        });
        it("should add necessary 'class variables'", function() {
            var Position = Component("Position", function(x, y) {
                this.x = x;
                this.y = y;
            });
            var position = new Position(2, 3);
            assert.strictEqual("Position", position.constructor.componentName());
        });
    });
});