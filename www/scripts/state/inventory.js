var Phaser = require("phaser");

var Inventory = function(game) {
    this.avatar = null;
    this.playMemento = null;
};

Inventory.prototype = {
    init: init,
    create: create,
    update: update
}

function init(avatar, playMemento) {
    this.avatar = avatar;
    this.playMemento = playMemento;
}

function create() {
}

function update() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.I))
    {
        this.game.state.start("Play", true, false, this.playMemento);
    }
}

module.exports = Inventory;
