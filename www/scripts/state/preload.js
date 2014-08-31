var Phaser = require("phaser");

var Preload = function(game) {
};

Preload.prototype = {
    preload: preload,
    create: create
}

function preload() {
    this.load.spritesheet("maxim", "assets/images/maxim.png", 15, 18);
    this.load.spritesheet("chest", "assets/images/chest.png", 15, 14);
    this.load.image("menu_background", "assets/images/menu_background.png");
    this.load.image("status_bar", "assets/images/status_bar.png");
    this.load.image("health_bar", "assets/images/health_bar.png");
    this.load.image("magic_bar", "assets/images/magic_bar.png");
    this.load.image("dungeon", "assets/images/tileset.png");
    this.load.tilemap("map", "assets/maps/map.json", null, Phaser.Tilemap.TILED_JSON);
}

function create() {
    this.state.start("Play");
}

module.exports = Preload;
