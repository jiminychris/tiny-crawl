var assert = require("assert");
var World = require("../ecs/world");
var Exception = require("../exception");

function Health() {};
Health.componentName = function() {return "Health";};

describe("World", function() {
    describe("#createEntity()", function() {
        it("should create unique IDs", function() {
            var world = new World();
            var e0 = world.createEntity();
            var e1 = world.createEntity();
            assert.notEqual(e0, e1);
        });
        it("should reuse deleted IDs", function() {
            var world = new World();
            var e0 = world.createEntity();
            var e1 = world.createEntity();
            var e2 = world.createEntity();
            world.killEntity(e1);
            assert.strictEqual(e1, world.createEntity());
        });
    });
    describe("#addComponent()", function() {
        it("should throw an exception when referencing an undefined entity", function() {
            var world = new World();
            var health = new Health();
            assert.throws(function() {
                world.addComponent(0, health);
            }, Exception);
        });
        it("should throw an exception when referencing a deleted entity", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            world.killEntity(e0);
            assert.throws(function() {
                world.addComponent(e0, health);
            }, Exception);
        });
        it("should not throw an exception when used properly", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            assert.doesNotThrow(function() {
                world.addComponent(e0, health);
            }, Exception);
        });
    });
    describe("#fetchComponent()", function() {
        it("should fetch the proper component", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            assert.strictEqual(health, world.fetchComponent(e0, Health.componentName()));
        });
    });
});