var Phaser = require("phaser");

var Inventory = function(game) {
    this.avatar = null;
};

Inventory.prototype = {
    init: init,
    create: create,
    update: update
}

function init(avatar) {
    this.avatar = avatar;
}

function create() {
}

function update() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.I))
    {
        this.game.state.start("Play");
    }
}

module.exports = Inventory;
