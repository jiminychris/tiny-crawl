var Phaser = require("phaser");

/**
* A Sample Plugin demonstrating how to hook into the Phaser plugin system.
*/
Phaser.Plugin.Embiggen = function (game, parent) {

    Phaser.Plugin.call(this, game, parent);

    this.scale = null;
    this.canvas = null;
    this.context = null;
    this.width = 0;
    this.height = 0;
    this.visible = true;
};

//  Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.Embiggen.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Embiggen.prototype.constructor = Phaser.Plugin.Embiggen;

/**
* Add a Sprite reference to this Plugin.
* All this plugin does is move the Sprite across the screen slowly.
* @type {Phaser.Sprite}
*/
Phaser.Plugin.Embiggen.prototype.init = function (scale) {

    this.scale = scale;
    this.canvas = Phaser.Canvas.create(this.game.width * scale, this.game.height * scale);
    this.context = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    //  Hide the un-scaled game canvas
    this.game.canvas.style['display'] = 'none';
 
    //  Add the scaled canvas to the DOM
    Phaser.Canvas.addToDOM(this.canvas, this.game.parent);
 
    //  Disable smoothing on the scaled canvas
    Phaser.Canvas.setSmoothingEnabled(this.context, false);
};

Phaser.Plugin.Embiggen.prototype.render = function() {
    this.context.drawImage(this.game.canvas, 0, 0,
        this.game.width, this.game.height, 0, 0, this.width, this.height);
};
