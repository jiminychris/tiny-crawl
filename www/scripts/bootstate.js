var Phaser = require("phaser");
var Settings = require("./settings");
var PreloadState = require("./preloadstate");
var PlayState = require("./playstate");
var $ = require("jquery");

var BootState = function() {
};

BootState.prototype = {
    init: init,
    create: create
}

function init() {
    this.game.renderer.renderSession.roundPixels = true;
    this.game.pixel = { scale: Settings.scale(), canvas: null, context: null, width: 0, height: 0, render: render };
}

function create() {
    var pixel = this.game.pixel;

    var container = $("#game-container").height(Settings.height()*Settings.scale())
        .width(Settings.width()*Settings.scale())
        .css("border", (Settings.borderThickness()*Settings.scale()).toString() + "px solid black");

    //  Hide the un-scaled game canvas
    this.game.canvas.style['display'] = 'none';
 
    //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
    pixel.canvas = Phaser.Canvas.create(this.game.width * pixel.scale, this.game.height * pixel.scale);
 
    //  Store a reference to the Canvas Context
    pixel.context = pixel.canvas.getContext('2d');
 
    //  Add the scaled canvas to the DOM
    Phaser.Canvas.addToDOM(pixel.canvas, "game-container");
 
    //  Disable smoothing on the scaled canvas
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
 
    //  Cache the width/height to avoid looking it up every render
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;

    this.state.add("Preload", PreloadState);
    this.state.add("Play", PlayState);

    this.state.start("Preload");
}

function render(game) {
    // Every loop we need to render the un-scaled game canvas to the displayed
    // scaled canvas:
    game.pixel.context.drawImage(game.canvas, 0, 0,
        game.width, game.height, 0, 0, game.pixel.width, game.pixel.height);
}

module.exports = BootState;
