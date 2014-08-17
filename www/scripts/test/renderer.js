var should = require("chai").should();
var Renderer = require("../ecs/renderer/renderer");
var Exception = require("../Exception");

describe("#Renderer", function() {
    it("should create a new renderer object", function() {
        var Position = 0, Camera = 1, Renderable = 2;
        var CameraRenderer = Renderer("CameraRenderer", [Camera, Position], [Renderable, Position], function(aspects, dt) { });

        CameraRenderer.rendererName().should.equal("CameraRenderer");
        CameraRenderer.viewportAspect().should.have.length(2);
        CameraRenderer.viewportAspect().should.include(Camera);
        CameraRenderer.viewportAspect().should.include(Position);
        CameraRenderer.renderableAspect().should.have.length(2);
        CameraRenderer.renderableAspect().should.include(Renderable);
        CameraRenderer.renderableAspect().should.include(Position);
        should.not.throw(function() {CameraRenderer.render();}, Exception);
    });
});