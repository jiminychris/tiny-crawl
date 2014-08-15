var assert = require("assert");
var World = require("../ecs/world");
var Exception = require("../exception");
var _ = require("underscore");

describe("World", function() {
    function Health() {
        this.max = 10;
        this.current = 5;
    };
    function Threat() {
        this.power = 2;
    };
    function DamageSystem() {};

    beforeEach(function() {
        Health.componentName = function() { return "Health"; };

        Threat.componentName = function() { return "Threat"; };

        DamageSystem.getAspect = function() { return [Health]; };
        DamageSystem.systemName = function() { return "DamageSystem"; };
        DamageSystem.tick = function(aspects, dt) { };
    });

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
            assert.strictEqual(health, world.fetchComponent(e0, Health));
        });
        it("should return null for a non-present component", function() {
            var world = new World();
            var e0 = world.createEntity();
            assert.strictEqual(null, world.fetchComponent(e0, Health));
        });
    });
    describe("#removeComponent()", function() {
        it("should remove the proper component", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            assert.strictEqual(health, world.fetchComponent(e0, Health));
            world.removeComponent(e0, Health);
            assert.strictEqual(null, world.fetchComponent(e0, Health));
        });
    });
    describe("#addSystem()", function() {
        it("should not throw exception when adding system", function() {
            var world = new World();
            assert.doesNotThrow(function() {
                world.addSystem(DamageSystem);
            }, Exception);
        });
        it("should not throw exception when adding system after corresponding component", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            assert.doesNotThrow(function() {
                world.addSystem(DamageSystem);
            }, Exception);
        });
        it("should throw exception when adding system more than once", function() {
            var world = new World();
            world.addSystem(DamageSystem);
            assert.throws(function() {
                world.addSystem(DamageSystem);
            }, Exception);
        });
    });
    describe("#tick()", function() {
        it("should not throw exception with no systems", function() {
            var world = new World();
            assert.doesNotThrow(function() {
                world.tick(0);
            }, Exception);
        });
        it("should not throw exception with one working system", function() {
            var world = new World();
            world.addSystem(DamageSystem);
            assert.doesNotThrow(function() {
                world.tick(0);
            }, Exception);
        });
        it("should pass the correct aspect to a system (components added first)", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            world.addSystem(DamageSystem);
            DamageSystem.tick = function(aspects, dt) {
                assert.strictEqual(health, aspects[0][Health.componentName()]);
            };
            world.tick(0);
        });
        it("should pass the correct aspect to a system (system added first)", function() {
            var world = new World();
            world.addSystem(DamageSystem);
            var health = new Health();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            DamageSystem.tick = function(aspects, dt) {
                assert.strictEqual(health, aspects[0][Health.componentName()]);
            };
            world.tick(0);
        });
        it("should pass the correct aspect to a system (two components)", function() {
            DamageSystem.getAspect = function() { return [Health, Threat]; };
            var world = new World();
            world.addSystem(DamageSystem);
            var health = new Health();
            var threat = new Threat();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            world.addComponent(e0, threat);
            DamageSystem.tick = function(aspects, dt) {
                assert.strictEqual(2, _.size(aspects[0]));
            };
            world.tick(0);
        });
        it("should pass the correct aspect to a system (excess component)", function() {
            var world = new World();
            world.addSystem(DamageSystem);
            var health = new Health();
            var threat = new Threat();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            world.addComponent(e0, threat);
            DamageSystem.tick = function(aspects, dt) {
                assert.strictEqual(1, _.size(aspects[0]));
            };
            world.tick(0);
        });
        it("should pass the correct aspect to a system (removing necessary component)", function() {
            var world = new World();
            world.addSystem(DamageSystem);
            var health = new Health();
            var threat = new Threat();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            world.addComponent(e0, threat);
            DamageSystem.tick = function(aspects, dt) {
                assert.strictEqual(1, _.size(aspects));
            };
            world.tick(0);
            world.removeComponent(e0, Health);
            DamageSystem.tick = function(aspects, dt) {
                assert.strictEqual(0, _.size(aspects));
            };
            world.tick(0);
        });
    });
});