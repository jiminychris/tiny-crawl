var Renderer = require("./renderer");
var Camera = require("../component/camera");
var Renderable = require("../component/renderable");
var Position = require("../component/position");
var Settings = require("../../settings");
var _ = require("underscore");

var CameraRenderer = Renderer("CameraRenderer", [Camera, Position], [Renderable, Position], function(viewports, renderables) {
    _.each(viewports, function(viewport) {
        var camera = viewport(Camera);
        var bounds = camera.bounds();
        var screen = camera.screen();
        var zoom = camera.zoom();
        var viewportPosition = viewport(Position);
        var ctx = screen.getContext("2d");

        var cameraHalfWidth = screen.width * Settings.metersPerPixel() / 2 / zoom;
        var cameraHalfHeight = screen.height * Settings.metersPerPixel() / 2 / zoom;
        var viewportBox = {
            left: viewportPosition.x() - cameraHalfWidth,
            right: viewportPosition.x() + cameraHalfWidth,
            top: viewportPosition.y() + cameraHalfHeight,
            bottom: viewportPosition.y() - cameraHalfHeight
        };
        var outOfBounds = {
            left: bounds.left - viewportBox.left,
            right: bounds.right - viewportBox.right,
            top: bounds.top - viewportBox.top,
            bottom: bounds.bottom - viewportBox.bottom
        }
        if (outOfBounds.left > 0) {
            viewportBox.left += outOfBounds.left;
            viewportBox.right += outOfBounds.left;
        }
        else if (outOfBounds.right < 0) {
            viewportBox.left += outOfBounds.right;
            viewportBox.right += outOfBounds.right;
        }
        if (outOfBounds.top < 0) {
            viewportBox.top += outOfBounds.top;
            viewportBox.bottom += outOfBounds.top;
        }
        else if (outOfBounds.bottom > 0) {
            viewportBox.top += outOfBounds.bottom;
            viewportBox.bottom += outOfBounds.bottom;
        }

        ctx.fillRect(0, 0, screen.width, screen.height);
        _.each(_.sortBy(renderables, function(renderable) { return renderable(Position).z(); }), function(renderable) {
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
                ctx.drawImage(image,
                    (renderableBox.left - viewportBox.left)*Settings.pixelsPerMeter() * zoom,
                    (viewportBox.top - renderableBox.top)*Settings.pixelsPerMeter() * zoom,
                    image.width * zoom,
                    image.height * zoom);
            }
        });
    });
});

function collide(box1, box2) {
    return !(box1.right < box2.left || box1.left > box2.right || box1.top < box2.bottom || box1.bottom > box2.top);
}

module.exports = CameraRenderer;
