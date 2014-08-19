var $ = require("jquery");
var _ = require("underscore");
var World = require("./ecs/world");
var Position = require("./ecs/component/position");
var Velocity = require("./ecs/component/velocity");
var Input = require("./ecs/component/input");
var MovementSprites = require("./ecs/component/movementsprites");
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

function Messages() {
    return _.object(arguments, arguments);
}
var Intents = Messages("Stop", "WalkLeft", "WalkRight");

var Keyboard = {
    _listeners: [],
    _send: function(message) {
        _.each(Keyboard._listeners, function(listener) {
            listener(message);
        });
    },
    register: function(func) {
        Keyboard._listeners.push(func);
    },
    attach: function(control) {
        downedKeys = {};
        var speed = 1.4;
        control.attr("tabindex", 0);

        control.keydown(function(e) {
            switch(e.keyCode) {
                case 37:
                    if (!_.has(downedKeys, e.keyCode))
                    {
                        /*velocity.dx(velocity.dx()-speed);
                        world.removeComponent(avatar, Animation);
                        var animation = new Animation();
                        animation.frames(movementSprites.left());
                        animation.spf(.25);
                        world.addComponent(avatar, animation);*/
                        if (downedKeys[39]) {
                            Keyboard._send(Intents.Stop);
                        }
                        else
                            Keyboard._send(Intents.WalkLeft);
                        downedKeys[e.keyCode] = true;
                    }
                    break;
                case 39:
                    if (!_.has(downedKeys, e.keyCode))
                    {
                        /*velocity.dx(velocity.dx()+speed);
                        world.removeComponent(avatar, Animation);
                        var animation = new Animation();
                        animation.frames(movementSprites.right());
                        animation.spf(.25);
                        world.addComponent(avatar, animation);*/
                        if (downedKeys[37]) {
                            Keyboard._send(Intents.Stop);
                        }
                        else
                            Keyboard._send(Intents.WalkRight);
                        downedKeys[e.keyCode] = true;
                    }
                    break;
            }
        });
        control.keyup(function(e) {
            switch(e.keyCode) {
                case 37:
                    if (downedKeys[e.keyCode] === true)
                    {
                        /*world.removeComponent(avatar, Animation);
                        renderable.image(images.maximStandLeft);
                        velocity.dx(velocity.dx()+speed);*/
                        if (downedKeys[39]) {
                            Keyboard._send(Intents.WalkRight);
                        }
                        else
                            Keyboard._send(Intents.Stop);
                        delete downedKeys[e.keyCode];
                    }
                    break;
                case 39:
                    if (downedKeys[e.keyCode] === true)
                    {
                        /*world.removeComponent(avatar, Animation);
                        renderable.image(images.maximStandRight);
                        velocity.dx(velocity.dx()-speed);*/
                        if (downedKeys[37]) {
                            Keyboard._send(Intents.WalkLeft);
                        }
                        else
                            Keyboard._send(Intents.Stop);
                        delete downedKeys[e.keyCode];
                    }
                    break;
            }
        });
    }
}

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
    var movementSprites = new MovementSprites();
    movementSprites.right(images.maximWalkRight);
    movementSprites.left(images.maximWalkLeft);
    var input = new Input();
    input.source(Keyboard);
    world.addComponent(avatar, position);
    world.addComponent(avatar, velocity);
    world.addComponent(avatar, camera);
    world.addComponent(avatar, renderable);
    world.addComponent(avatar, movementSprites);
    world.addComponent(avatar, input);
    for (var i=0; i<8; i++)
        addSlab(world, images.slab, (12+i*24)*Settings.metersPerPixel(), 10*Settings.metersPerPixel());

    $(document).ready(function() {
        Keyboard.attach($("div#game-container").append(screen));

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
