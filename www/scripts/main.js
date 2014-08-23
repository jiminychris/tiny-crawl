var Phaser = require("phaser");

var game = new Phaser.Game(88, 31, Phaser.CANVAS, "",
    {init: init, preload: preload, create: create,
        update: update, render: render});

var pixel = { scale: 10, canvas: null, context: null, width: 0, height: 0 };

function init() {
 
    //  Hide the un-scaled game canvas
    game.canvas.style['display'] = 'none';
 
    //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
    pixel.canvas = Phaser.Canvas.create(game.width * pixel.scale, game.height * pixel.scale);
 
    //  Store a reference to the Canvas Context
    pixel.context = pixel.canvas.getContext('2d');
 
    //  Add the scaled canvas to the DOM
    Phaser.Canvas.addToDOM(pixel.canvas);
 
    //  Disable smoothing on the scaled canvas
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
 
    //  Cache the width/height to avoid looking it up every render
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;
 
}

function preload() {
    game.load.spritesheet("maxim", "images/maxim.png", 15, 18)
}

var player;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(10, 10, "maxim");

    game.physics.arcade.enable(player);

    player.animations.add("right", [1, 2, 3, 4], 10, true);
    player.anchor.setTo(.5, .5);
}

function update() {

}

function render() {
    // Every loop we need to render the un-scaled game canvas to the displayed
    // scaled canvas:
    pixel.context.drawImage(game.canvas, 0, 0,
        game.width, game.height, 0, 0, pixel.width, pixel.height);
}
