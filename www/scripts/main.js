var $ = require("jquery");
var World = require("./ecs/world");
var Position = require("./ecs/component/position");
var Animation = require("./ecs/component/animation");
var Renderable = require("./ecs/component/renderable");
var Camera = require("./ecs/component/camera");
var AnimationSystem = require("./ecs/system/animationsystem");
var CameraRenderer = require("./ecs/renderer/camerarenderer");
var Settings = require("./settings");

var spritesheet = new Image();

spritesheet.onload = function() {
    var wallTile = document.createElement("canvas");
    wallTile.width = 8;
    wallTile.height = 8;
    wallTile.getContext("2d").drawImage(spritesheet, 0, 0);
    main({"wallTile": wallTile});
};
spritesheet.src = "images/spritesheet.png";

function main(images) {
    var screen = document.createElement("canvas");
    screen.width = 88;
    screen.height = 31;
    var world = new World();
    world.addRenderer(CameraRenderer);
    var entity = world.createEntity();
    var position = new Position();
    position.x(0);
    position.y(0);
    var camera = new Camera();
    camera.width(88);
    camera.height(31);
    world.addComponent(entity, position);
    world.addComponent(entity, camera);
    for (var j=0; j<5; j++)
        for (var i=0; i<20; i++)
            addTile(world, images.wallTile, (4+i*8)*Settings.metersPerPixel(), (4+j*8)*Settings.metersPerPixel());


    window.addEventListener("keydown", function(e) {
        switch(e.keyCode) {
            case 37:
                position.x(position.x()-1);
                break;
            case 38:
                position.y(position.y()+1);
                break;
            case 39:
                position.x(position.x()+1);
                break;
            case 40:
                position.y(position.y()-1);
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
        })();
        (function render(){
            screen.getContext("2d").fillRect(0, 0, 88, 31);
            window.requestAnimationFrame(render);
            world.render(screen);
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