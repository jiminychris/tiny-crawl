var Renderer = require("./renderer");
var Camera = require("../component/camera");
var Renderable = require("../component/renderable");
var Position = require("../component/position");
var Settings = require("../../settings");
var _ = require("underscore");

var CameraRenderer = Renderer("CameraRenderer", [Camera, Position], [Renderable, Position], function(screen, viewports, renderables) {
    _.each(viewports, function(viewport) {
        var camera = viewport(Camera);
        var viewportPosition = viewport(Position);
        var canvas = newCanvas(camera.width(), camera.height());
        var ctx = canvas.getContext("2d");

        var cameraHalfWidth = camera.width() * Settings.metersPerPixel() / 2;
        var cameraHalfHeight = camera.height() * Settings.metersPerPixel() / 2;
        var viewportBox = {
            left: viewportPosition.x() - cameraHalfWidth,
            right: viewportPosition.x() + cameraHalfWidth,
            top: viewportPosition.y() + cameraHalfHeight,
            bottom: viewportPosition.y() - cameraHalfHeight
        };

        _.each(renderables, function(renderable) {
            var position = renderable(Position);
            var image = renderable(Renderable).image();

            var renderableHalfWidth = image.width * Settings.metersPerPixel() / 2;
            var renderableHalfHeight = image.height * Settings.metersPerPixel() / 2;
            var renderableBox = {
                left: position.x() - renderableHalfWidth,
                right: position.x() + renderableHalfWidth,
                top: position.y() + renderableHalfHeight,
                bottom: position.y() - renderableHalfHeight
            };
            if (collide(viewportBox, renderableBox)) {
                ctx.drawImage(image, (renderableBox.left - viewportBox.left)*Settings.pixelsPerMeter(), (viewportBox.top - renderableBox.top)*Settings.pixelsPerMeter());
            }
        });
        screen.getContext("2d").drawImage(canvas, 0, 0);
    });
});

function collide(box1, box2) {
    return !(box1.right < box2.left || box1.left > box2.right || box1.top < box2.bottom || box1.bottom > box2.top);
}

function newCanvas(width, height)
{
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false; /// future
    return canvas;
}

module.exports = CameraRenderer;
