var $ = require("jquery");
var _ = require("underscore");
var World = require("./ecs/world");
var Position = require("./ecs/component/position");
var Velocity = require("./ecs/component/velocity");
var Animation = require("./ecs/component/animation");
var Renderable = require("./ecs/component/renderable");
var Camera = require("./ecs/component/camera");
var PhysicsSystem = require("./ecs/system/physicssystem");
var AnimationSystem = require("./ecs/system/animationsystem");
var CameraRenderer = require("./ecs/renderer/camerarenderer");
var Settings = require("./settings");

var spritesheet = new Image();

spritesheet.onload = function() {
    var wallTile = newCanvas(8, 8);
    wallTile.getContext("2d").drawImage(spritesheet, 0, 0);
    main({"wallTile": wallTile});
};
spritesheet.src = "images/spritesheet.png";

function main(images) {
    var zoom = 8;
    var screen = newCanvas(78*zoom, 29*zoom);
    var world = new World();
    world.addSystem(PhysicsSystem);
    world.addRenderer(CameraRenderer);
    var entity = world.createEntity();
    var position = new Position();
    position.x(3.9);
    position.y(1.45);
    var velocity = new Velocity();
    velocity.dx(0);
    velocity.dy(0);
    var camera = new Camera();
    camera.screen(screen);
    camera.zoom(zoom);
    world.addComponent(entity, position);
    world.addComponent(entity, velocity);
    world.addComponent(entity, camera);
    for (var j=0; j<5; j++)
        for (var i=0; i<20; i++)
            addTile(world, images.wallTile, (4+i*8)*Settings.metersPerPixel(), (4+j*8)*Settings.metersPerPixel());

    downedKeys = {};
    var speed = 1.4;
    window.addEventListener("keydown", function(e) {
        switch(e.keyCode) {
            case 37:
                if (!_.has(downedKeys, e.keyCode))
                {
                    velocity.dx(velocity.dx()-speed);
                    downedKeys[e.keyCode] = true;
                }
                break;
            case 38:
                if (!_.has(downedKeys, e.keyCode))
                {
                    velocity.dy(velocity.dy()+speed);
                    downedKeys[e.keyCode] = true;
                }
                break;
            case 39:
                if (!_.has(downedKeys, e.keyCode))
                {
                    velocity.dx(velocity.dx()+speed);
                    downedKeys[e.keyCode] = true;
                }
                break;
            case 40:
                if (!_.has(downedKeys, e.keyCode))
                {
                    velocity.dy(velocity.dy()-speed);
                    downedKeys[e.keyCode] = true;
                }
                break;
        }
    });
    window.addEventListener("keyup", function(e) {
        switch(e.keyCode) {
            case 37:
                if (_.has(downedKeys, e.keyCode))
                {
                    velocity.dx(velocity.dx()+speed);
                    delete downedKeys[e.keyCode];
                }
                break;
            case 38:
                if (_.has(downedKeys, e.keyCode))
                {
                    velocity.dy(velocity.dy()-speed);
                    delete downedKeys[e.keyCode];
                }
                break;
            case 39:
                if (_.has(downedKeys, e.keyCode))
                {
                    velocity.dx(velocity.dx()-speed);
                    delete downedKeys[e.keyCode];
                }
                break;
            case 40:
                if (_.has(downedKeys, e.keyCode))
                {
                    velocity.dy(velocity.dy()+speed);
                    delete downedKeys[e.keyCode];
                }
                break;
        }
    });


    $(document).ready(function() {
        $("div#game-container").append(screen);
        (function tick(lastTime)
        {
            var currentTime = Date.now()
            setTimeout(function() { tick(currentTime) }, 10);
            var dt = (currentTime - lastTime)/1000;
            world.tick(dt);
        })(Date.now());
        (function render(){
            window.requestAnimationFrame(render);
            world.render();
        })();
    });
};

function addTile(world, image, x, y) {
    var entity = world.createEntity();
    var position = new Position();
    var renderable = new Renderable();
    position.x(x);
    position.y(y);
    world.addComponent(entity, position);
    renderable.image(image);
    world.addComponent(entity, renderable);
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
