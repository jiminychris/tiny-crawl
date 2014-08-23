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
var cursors;
var orientation = "right";

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(10, 10, "maxim");

    game.physics.arcade.enable(player);

    player.animations.add("left", [1, 2, 3, 4], 4, true);
    player.animations.add("right", [6, 7, 8, 9], 4, true);
}

function update() {
    cursors = game.input.keyboard.createCursorKeys();

    player.body.velocity.x = 0;

    if (cursors.left.isDown && !cursors.right.isDown)
    {
        player.body.velocity.x = -10;
        orientation = "left";
        player.animations.play("left");
    }
    else if (cursors.right.isDown && !cursors.left.isDown)
    {
        player.body.velocity.x = 10;
        orientation = "right";
        player.animations.play("right");
    }
    else
    {
        player.animations.stop();
        if (orientation == "left")
            player.frame = 0;
        else
            player.frame = 5;
    }
}

function render() {
    // Every loop we need to render the un-scaled game canvas to the displayed
    // scaled canvas:
    pixel.context.drawImage(game.canvas, 0, 0,
        game.width, game.height, 0, 0, pixel.width, pixel.height);
}
