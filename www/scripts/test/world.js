var should = require("chai").should();
var World = require("../ecs/world");
var Exception = require("../exception");
var _ = require("underscore");

describe("World", function() {
    function Health() {
        this.max = 10;
        this.current = 5;
    };
    function Position() {
        this.x = 0;
        this.y = 0;
    };
    function Camera() {
        this.width = 0;
        this.height = 0;
    };
    function Renderable() {
        this.image = null;
    };
    function Threat() {
        this.power = 2;
    };
    var DamageSystem = {};
    var CameraRenderer = {};

    beforeEach(function() {
        Health.componentName = function() { return "Health"; };
        Threat.componentName = function() { return "Threat"; };
        Position.componentName = function() { return "Position"; };
        Renderable.componentName = function() { return "Renderable"; };
        Camera.componentName = function() { return "Camera"; };

        DamageSystem.aspect = function() { return [Health]; };
        DamageSystem.systemName = function() { return "DamageSystem"; };
        DamageSystem.tick = function(world, aspects, dt) { };

        CameraRenderer.rendererName = function() { return "CameraRenderer"; };
        CameraRenderer.viewportAspect = function() { return [Camera, Position]; };
        CameraRenderer.renderableAspect = function() { return [Renderable, Position]; };
        CameraRenderer.render = function(viewports, renderables) { };
    });

    describe("#createEntity()", function() {
        it("should create unique IDs", function() {
            var world = new World();
            var e0 = world.createEntity();
            var e1 = world.createEntity();
            e0.should.not.equal(e1);
        });
        it("should reuse deleted IDs", function() {
            var world = new World();
            var e0 = world.createEntity();
            var e1 = world.createEntity();
            var e2 = world.createEntity();
            world.killEntity(e1);
            world.createEntity().should.equal(e1);
        });
    });
    describe("#addComponent()", function() {
        it("should throw an exception when referencing an undefined entity", function() {
            var world = new World();
            var health = new Health();
            should.throw(function() {
                world.addComponent(0, health);
            }, Exception);
        });
        it("should throw an exception when referencing a deleted entity", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            world.killEntity(e0);
            should.throw(function() {
                world.addComponent(e0, health);
            }, Exception);
        });
        it("should not throw an exception when used properly", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            should.not.throw(function() {
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
            world.fetchComponent(e0, Health).should.equal(health);
        });
        it("should return null for a non-present component", function() {
            var world = new World();
            var e0 = world.createEntity();
            should.not.exist(world.fetchComponent(e0, Health));
        });
    });
    describe("#removeComponent()", function() {
        it("should remove the proper component", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            world.fetchComponent(e0, Health).should.equal(health);
            world.removeComponent(e0, Health);
            should.not.exist(world.fetchComponent(e0, Health));
        });
    });
    describe("#addSystem()", function() {
        it("should not throw exception when adding system", function() {
            var world = new World();
            should.not.throw(function() {
                world.addSystem(DamageSystem);
            }, Exception);
        });
        it("should not throw exception when adding system after corresponding component", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            should.not.throw(function() {
                world.addSystem(DamageSystem);
            }, Exception);
        });
        it("should throw exception when adding system more than once", function() {
            var world = new World();
            world.addSystem(DamageSystem);
            should.throw(function() {
                world.addSystem(DamageSystem);
            }, Exception);
        });
    });
    describe("#tick()", function() {
        it("should not throw exception with no systems", function() {
            var world = new World();
            should.not.throw(function() {
                world.tick(0);
            }, Exception);
        });
        it("should not throw exception with one working system", function() {
            var world = new World();
            world.addSystem(DamageSystem);
            should.not.throw(function() {
                world.tick(0);
            }, Exception);
        });
        it("should pass the correct aspect to a system (components added first)", function() {
            var world = new World();
            var health = new Health();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            world.addSystem(DamageSystem);
            DamageSystem.tick = function(world, aspects, dt) {
                aspects[0](Health).should.equal(health);
            };
            world.tick(0);
        });
        it("should pass the correct aspect to a system (system added first)", function() {
            var world = new World();
            world.addSystem(DamageSystem);
            var health = new Health();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            DamageSystem.tick = function(world, aspects, dt) {
                aspects[0](Health).should.equal(health);
            };
            world.tick(0);
        });
        it("should pass the correct aspect to a system (two components)", function() {
            DamageSystem.aspect = function() { return [Health, Threat]; };
            var world = new World();
            world.addSystem(DamageSystem);
            var health = new Health();
            var threat = new Threat();
            var e0 = world.createEntity();
            world.addComponent(e0, health);
            world.addComponent(e0, threat);
            DamageSystem.tick = function(world, aspects, dt) {
                aspects[0](Health).should.equal(health);
                aspects[0](Threat).should.equal(threat);
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
            DamageSystem.tick = function(world, aspects, dt) {
                aspects[0](Health).should.equal(health);
                should.not.exist(aspects[0](Threat));
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
            DamageSystem.tick = function(world, aspects, dt) {
                _.size(aspects).should.equal(1);
            };
            world.tick(0);
            world.removeComponent(e0, Health);
            DamageSystem.tick = function(world, aspects, dt) {
                _.size(aspects).should.equal(0);
            };
            world.tick(0);
        });
    });
    describe("#addRenderer()", function() {
        it("should not throw exception when adding renderer", function() {
            var world = new World();
            should.not.throw(function() {
                world.addRenderer(CameraRenderer);
            }, TypeError);
        });
        it("should throw exception when adding renderer more than once", function() {
            var world = new World();
            world.addRenderer(CameraRenderer);
            should.throw(function() {
                world.addRenderer(CameraRenderer);
            }, Exception);
        });
    });
    describe("#render()", function() {
        it("should exist", function() {
            var world = new World();
            should.exist(world.render);
            world.render.should.be.a("function");
        });
        it("should pass the proper aspects into renderer (components added first)", function() {
            var world = new World();
            var e0 = world.createEntity();
            var e1 = world.createEntity();
            var e2 = world.createEntity();
            var e0Position = new Position();
            var camera = new Camera();
            var e1Position = new Position();
            e1Position.x = 1;
            e1Position.y = 1;
            var e1Renderable = new Renderable();
            e1Renderable.image = "hi";
            var e2Position = new Position();
            e2Position.x = 2;
            e2Position.y = 2;
            var e2Renderable = new Renderable();
            e2Renderable.image = "hello";

            CameraRenderer.render = function(viewports, renderables) {
                viewports[0](Position).x.should.equal(0);
                renderables[0](Position).x.should.equal(1);
                renderables[0](Renderable).image.should.equal("hi");
                renderables[1](Position).x.should.equal(2);
                renderables[1](Renderable).image.should.equal("hello");
                renderables.should.have.length(2);
            };

            world.addComponent(e0, e0Position);
            world.addComponent(e0, camera);
            world.addComponent(e1, e1Position);
            world.addComponent(e1, e1Renderable);
            world.addComponent(e2, e2Position);
            world.addComponent(e2, e2Renderable);

            world.addRenderer(CameraRenderer);

            world.render();
        });

        it("should pass the proper aspects into renderer (renderer added first)", function() {
            var world = new World();
            var e0 = world.createEntity();
            var e1 = world.createEntity();
            var e2 = world.createEntity();
            var e0Position = new Position();
            var camera = new Camera();
            var e1Position = new Position();
            e1Position.x = 1;
            e1Position.y = 1;
            var e1Renderable = new Renderable();
            e1Renderable.image = "hi";
            var e2Position = new Position();
            e2Position.x = 2;
            e2Position.y = 2;
            var e2Renderable = new Renderable();
            e2Renderable.image = "hello";

            CameraRenderer.render = function(viewports, renderables) {
                viewports[0](Position).x.should.equal(0);
                renderables[0](Position).x.should.equal(1);
                renderables[0](Renderable).image.should.equal("hi");
                renderables[1](Position).x.should.equal(2);
                renderables[1](Renderable).image.should.equal("hello");
                renderables.should.have.length(2);
            };

            world.addRenderer(CameraRenderer);

            world.addComponent(e0, e0Position);
            world.addComponent(e0, camera);
            world.addComponent(e1, e1Position);
            world.addComponent(e1, e1Renderable);
            world.addComponent(e2, e2Position);
            world.addComponent(e2, e2Renderable);

            world.render();
        });

        it("should pass the proper aspects into renderer (removing necessary components)", function() {
            var world = new World();
            var e0 = world.createEntity();
            var e1 = world.createEntity();
            var e2 = world.createEntity();
            var e0Position = new Position();
            var camera = new Camera();
            var e1Position = new Position();
            e1Position.x = 1;
            e1Position.y = 1;
            var e1Renderable = new Renderable();
            e1Renderable.image = "hi";
            var e2Position = new Position();
            e2Position.x = 2;
            e2Position.y = 2;
            var e2Renderable = new Renderable();
            e2Renderable.image = "hello";

            CameraRenderer.render = function(viewports, renderables) {
                viewports[0](Position).x.should.equal(0);
                renderables[0](Position).x.should.equal(1);
                renderables[0](Renderable).image.should.equal("hi");
                renderables.should.have.length(1);
            };

            world.addRenderer(CameraRenderer);

            world.addComponent(e0, e0Position);
            world.addComponent(e0, camera);
            world.addComponent(e1, e1Position);
            world.addComponent(e1, e1Renderable);
            world.addComponent(e2, e2Position);
            world.addComponent(e2, e2Renderable);

            world.removeComponent(e2, Renderable);

            world.render();
        });
    });
});