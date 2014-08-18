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

var spritesheet = new Image();

spritesheet.onload = function() {
    var wallTile = newCanvas(8, 8);
    var maximStand = newCanvas(15, 18);
    var maximWalkLeft = [newCanvas(15, 18),newCanvas(15, 18),newCanvas(15, 18),newCanvas(15, 18)];
    var maximWalkRight = [newCanvas(15, 18),newCanvas(15, 18),newCanvas(15, 18),newCanvas(15, 18)];
    wallTile.getContext("2d").drawImage(spritesheet, 0, 0);
    maximStand.getContext("2d").drawImage(spritesheet, 0, 8, 15, 18, 0, 0, 15, 18);
    for (var i=0; i<4; i++)
        maximWalkRight[i].getContext("2d").drawImage(spritesheet, 15*(1+i), 8, 15, 18, 0, 0, 15, 18);
    for (var i=0; i<4; i++)
    {
        var ctx = maximWalkLeft[i].getContext("2d");
        ctx.translate(maximWalkLeft.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(spritesheet, 15*(1+i), 8, 15, 18, 0, 0, 15, 18);
    }
    main({
        "wallTile": wallTile,
        "maximStand": maximStand,
        "maximWalkLeft": maximWalkLeft,
        "maximWalkRight": maximWalkRight,
    });
};
spritesheet.src = "images/spritesheet.png";

function main(images) {
    var zoom = 8;
    var screen = newCanvas(86*zoom, 21*zoom);
    var world = new World();
    world.addSystem(PhysicsSystem);
    world.addSystem(AnimationSystem);
    world.addRenderer(CameraRenderer);
    var avatar = world.createEntity();
    var position = new Position();
    position.x(4.3);
    position.y(.4);
    position.z(1);
    var velocity = new Velocity();
    velocity.dx(0);
    velocity.dy(0);
    var camera = new Camera();
    camera.screen(screen);
    camera.zoom(zoom);
    camera.bounds({
        left: 0,
        right: 16,
        bottom: -.6
    });
    var renderable = new Renderable();
    renderable.image(images.maximStand);
    var movementSprites = new MovementSprites();
    movementSprites.right(images.maximWalkRight);
    movementSprites.left(images.maximWalkLeft);
    world.addComponent(avatar, position);
    world.addComponent(avatar, velocity);
    world.addComponent(avatar, camera);
    world.addComponent(avatar, renderable);
    world.addComponent(avatar, movementSprites);
    for (var j=0; j<2; j++)
        for (var i=0; i<20; i++)
            addTile(world, images.wallTile, (4+i*8)*Settings.metersPerPixel(), (4+j*8)*Settings.metersPerPixel());

    downedKeys = {};
    var speed = 1.4;
    $(screen)
    // Add tab index to ensure the canvas retains focus
    .attr("tabindex", "0")
    // Mouse down override to prevent default browser controls from appearing
    .mousedown(function(){ $(this).focus(); return false; });

    screen.addEventListener("keydown", function(e) {
        switch(e.keyCode) {
            case 37:
                if (!_.has(downedKeys, e.keyCode))
                {
                    velocity.dx(velocity.dx()-speed);
                    world.removeComponent(avatar, animation);
                    var animation = new Animation();
                    animation.frames(movementSprites.left);
                    animation.spf(.25);
                    world.addComponent(avatar, animation);
                    downedKeys[e.keyCode] = true;
                }
                break;
            case 39:
                if (!_.has(downedKeys, e.keyCode))
                {
                    velocity.dx(velocity.dx()+speed);
                    world.removeComponent(avatar, animation);
                    var animation = new Animation();
                    animation.frames(movementSprites.right);
                    animation.spf(.25);
                    world.addComponent(avatar, animation);
                    downedKeys[e.keyCode] = true;
                }
                break;
        }
    });
    screen.addEventListener("keyup", function(e) {
        switch(e.keyCode) {
            case 37:
                if (_.has(downedKeys, e.keyCode))
                {
                    world.removeComponent(avatar, animation);
                    renderable.image(images.maximStand);
                    velocity.dx(velocity.dx()+speed);
                    delete downedKeys[e.keyCode];
                }
                break;
            case 39:
                if (_.has(downedKeys, e.keyCode))
                {
                    world.removeComponent(avatar, animation);
                    renderable.image(images.maximStand);
                    velocity.dx(velocity.dx()-speed);
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
