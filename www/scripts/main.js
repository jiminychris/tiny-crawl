var $ = require("jquery");
var _ = require("underscore");
var World = require("./ecs/world");
var Position = require("./ecs/component/position");
var Velocity = require("./ecs/component/velocity");
var MovementSprites = require("./ecs/component/movementsprites");
var Animation = require("./ecs/component/animation");
var Renderable = require("./ecs/component/renderable");
var Camera = require("./ecs/component/camera");
var PhysicsSystem = require("./ecs/system/physicssystem");
var AnimationSystem = require("./ecs/system/animationsystem");
var CameraRenderer = require("./ecs/renderer/camerarenderer");
var Settings = require("./settings");
var KeyboardPlayInput = require("./keyboardplayinput");
var Messages = require("./messages");

var spritesheet = new Image();

spritesheet.onload = function() {
    var wallTile = newCanvas(8, 8);
    var floorTile = newCanvas(24, 6);
    var slab = newCanvas(24, 22);
    var maximStandRight = newCanvas(15, 18);
    var maximWalkLeft = [newCanvas(15, 18),newCanvas(15, 18),newCanvas(15, 18),newCanvas(15, 18)];
    var maximWalkRight = [newCanvas(15, 18),newCanvas(15, 18),newCanvas(15, 18),newCanvas(15, 18)];
    wallTile.getContext("2d").drawImage(spritesheet, 0, 0);
    floorTile.getContext("2d").drawImage(spritesheet, 16, 0, 24, 6, 0, 0, 24, 6);
    maximStandRight.getContext("2d").drawImage(spritesheet, 0, 8, 15, 18, 0, 0, 15, 18);
    var maximStandLeft = flipped(maximStandRight);
    for (var i=0; i<4; i++)
        maximWalkRight[i].getContext("2d").drawImage(spritesheet, 15*(1+i), 8, 15, 18, 0, 0, 15, 18);
    for (var i=0; i<4; i++)
        maximWalkLeft[i] = flipped(maximWalkRight[i]);
    for (var j=0; j<2; j++)
        for (var i=0; i<3; i++)
            slab.getContext("2d").drawImage(wallTile, i*8, j*8);
    slab.getContext("2d").drawImage(floorTile, 0, 16);
    main({
        "slab": slab,
        "maximStandRight": maximStandRight,
        "maximStandLeft": maximStandLeft,
        "maximWalkLeft": maximWalkLeft,
        "maximWalkRight": maximWalkRight,
    });
};
spritesheet.src = "images/spritesheet.png";

function flipped(canvas) {
    var result = newCanvas(canvas.width, canvas.height);
    var ctx = result.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    result.getContext("2d").drawImage(canvas, 0, 0);
    return result;
};

function main(images) {
    var zoom = 10;
    var screen = newCanvas(86*zoom, 21*zoom);
    var world = new World();
    world.addSystem(PhysicsSystem);
    world.addSystem(AnimationSystem);
    world.addRenderer(CameraRenderer);
    var avatar = world.createEntity();
    var position = new Position();
    position.x(15/2*Settings.metersPerPixel());
    position.y(18/2*Settings.metersPerPixel());
    position.z(1);
    var velocity = new Velocity();
    velocity.dx(0);
    velocity.dy(0);
    var camera = new Camera();
    camera.screen(screen);
    camera.zoom(zoom);
    camera.bounds({
        left: 0,
        right: 24*8*Settings.metersPerPixel(),
        bottom: -1*Settings.metersPerPixel()
    });
    var renderable = new Renderable();
    renderable.image(images.maximStandRight);
    world.addComponent(avatar, position);
    world.addComponent(avatar, velocity);
    world.addComponent(avatar, camera);
    world.addComponent(avatar, renderable);

    KeyboardPlayInput.register({
        state: Messages.Stop,
        receive: function(message) {
            var speed = 1.4;
            switch (message) {
                case Messages.Stop:
                    velocity.dx(0);
                    if (this.state === Messages.WalkLeft) {
                        world.removeComponent(avatar, Animation);
                        renderable.image(images.maximStandLeft);
                    } else if (this.state === Messages.WalkRight) {
                        world.removeComponent(avatar, Animation);
                        renderable.image(images.maximStandRight);
                    }
                    this.state = message;
                    break;
                case Messages.WalkRight:
                    world.removeComponent(avatar, Animation);
                    velocity.dx(speed);
                    var animation = new Animation();
                    animation.frames(images.maximWalkRight);
                    animation.spf(.25);
                    world.addComponent(avatar, animation);
                    this.state = message;
                    break;
                case Messages.WalkLeft:
                    world.removeComponent(avatar, Animation);
                    velocity.dx(-speed);
                    var animation = new Animation();
                    animation.frames(images.maximWalkLeft);
                    animation.spf(.25);
                    world.addComponent(avatar, animation);
                    this.state = message;
                    break;
            }
        }
    });

    for (var i=0; i<8; i++)
        addSlab(world, images.slab, (12+i*24)*Settings.metersPerPixel(), 10*Settings.metersPerPixel());

    $(document).ready(function() {
        KeyboardPlayInput.attach($("div#game-container")).append(screen).focus();

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

function addSlab(world, image, x, y) {
    var entity = world.createEntity();
    var position = new Position();
    var renderable = new Renderable();
    position.x(x);
    position.y(y);
    position.z(0);
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
