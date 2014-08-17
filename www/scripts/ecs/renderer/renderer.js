function Renderer(rendererName, viewportAspect, renderableAspect, render) {
    var renderer = {};
    renderer.rendererName = function() {
        return rendererName;
    };
    renderer.viewportAspect = function() {
        return viewportAspect;
    };
    renderer.renderableAspect = function() {
        return renderableAspect;
    };
    renderer.render = render;
    return renderer;
}

module.exports = Renderer;