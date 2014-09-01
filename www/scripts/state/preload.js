var Phaser = require("phaser");
var io = require("socket.io-client");

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
    this.game.io = io();
    var self = this;

    this.game.io.on('avatar load', function(data) {
        self.state.start("Play", true, false, data);
    });
}

module.exports = Preload;
