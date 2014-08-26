var Phaser = require("phaser");
var Settings = require("./settings");
var Avatar = require("./avatar");
var $ = require("jquery");

var game = new Phaser.Game(Settings.width(), Settings.height(), Phaser.CANVAS, "",
    {init: init, preload: preload, create: create,
        update: update, render: render});

var pixel = { scale: Settings.scale(), canvas: null, context: null, width: 0, height: 0 };

function init() {
    var container = $("#game-container").height(Settings.height()*Settings.scale())
        .width(Settings.width()*Settings.scale())
        .css("border", (Settings.borderThickness()*Settings.scale()).toString() + "px solid black");

    //  Hide the un-scaled game canvas
    game.canvas.style['display'] = 'none';
 
    //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
    pixel.canvas = Phaser.Canvas.create(game.width * pixel.scale, game.height * pixel.scale);
 
    //  Store a reference to the Canvas Context
    pixel.context = pixel.canvas.getContext('2d');
 
    //  Add the scaled canvas to the DOM
    Phaser.Canvas.addToDOM(pixel.canvas, "game-container");
 
    //  Disable smoothing on the scaled canvas
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
 
    //  Cache the width/height to avoid looking it up every render
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;
 
}

function preload() {
    game.load.spritesheet("maxim", "assets/images/maxim.png", 15, 18);
    game.load.image("menu_background", "assets/images/menu_background.png");
    game.load.image("status_bar", "assets/images/status_bar.png");
    game.load.image("health_bar", "assets/images/health_bar.png");
    game.load.image("magic_bar", "assets/images/magic_bar.png");
    game.load.image("dungeon", "assets/images/tileset.png");
    game.load.image("chest", "assets/images/chest.png");
    game.load.tilemap("map", "assets/maps/map.json", null, Phaser.Tilemap.TILED_JSON);
}

var avatar;
var health = { max: 100, current: 100 };
var health_bar;
var magic_bar;

function create() {
    game.world.setBounds(0, 0, 240, Settings.height());

    var map = game.add.tilemap("map");
    map.addTilesetImage("dungeon");
    map.addTilesetImage("chest");
    var layer = map.createLayer("Tile Layer 1");
    layer.resizeWorld();
    
    map.createFromObjects("Object Layer 1", 9, "chest", 0, true, false);


    avatar = game.add.existing(new Avatar(game, 8, Settings.height(), "maxim", 0));

    addHud(0, 0, "menu_background");
    addHud(1, 1, "status_bar");
    health_bar = addHud(2, 2, "health_bar");
    health_bar.max_width = health_bar.width;
    health_bar.crop(new Phaser.Rectangle(0, 0, health_bar.width, health_bar.height));
    magic_bar = addHud(2, 4, "magic_bar");
    magic_bar.max_width = magic_bar.width;
    health_bar.crop(new Phaser.Rectangle(0, 0, magic_bar.width, magic_bar.height));

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enable(avatar);

    avatar.animations.add("left", [1, 2, 3, 4], 4, true);
    avatar.animations.add("right", [6, 7, 8, 9], 4, true);
    avatar.anchor.setTo(.5, 1);

    game.camera.follow(avatar);
    game.camera.deadzone = new Phaser.Rectangle(Settings.width()/2-5, Settings.height()-1, 10, 0);
}

function update(game) {
    health_bar.cropRect.width = Math.ceil(health_bar.max_width*avatar.health.current/avatar.health.max);
    health_bar.updateCrop();
}

function render() {
    // Every loop we need to render the un-scaled game canvas to the displayed
    // scaled canvas:

    pixel.context.drawImage(game.canvas, 0, 0,
        game.width, game.height, 0, 0, pixel.width, pixel.height);
}

function addHud(x, y, key) {
    var hud = game.add.sprite(0, 0, key);
    hud.fixedToCamera = true;
    hud.cameraOffset.setTo(x, y);
    return hud;
}
