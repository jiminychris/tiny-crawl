var Phaser = require("phaser");

var Chest = function (game, x, y, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.contents = null;

    game.add.existing(this);

};

Chest.prototype = Object.create(Phaser.Sprite.prototype);
Chest.prototype.constructor = Chest;

module.exports = Chest;