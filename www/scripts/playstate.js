var Phaser = require("phaser");
var Settings = require("./settings");
var Avatar = require("./avatar");
var Chest = require("./chest");

var PlayState = function(game) {
    this.avatar = null;
    this.health_bar = null;
    this.magic_bar = null;
    this.chests = null;
};

PlayState.prototype = {
    create: create,
    update: update,
    render: render,
    addHud: addHud
}

function create() {
    var game = this.game;

    var map = game.add.tilemap("map");
    map.addTilesetImage("dungeon");
    map.addTilesetImage("chest");
    var layer = map.createLayer("Tile Layer 1");
    layer.resizeWorld();

    this.chests = game.add.group();
    this.chests.enableBody = true;
    
    map.createFromObjects("Object Layer 1", 5, "chest", 0, true, false, this.chests, Chest);

    this.avatar = new Avatar(game, 8, Settings.height(), "maxim", 0);

    this.addHud(0, 0, "menu_background");
    this.addHud(1, 1, "status_bar");
    this.health_bar = this.addHud(2, 2, "health_bar");
    this.health_bar.max_width = this.health_bar.width;
    this.health_bar.crop(new Phaser.Rectangle(0, 0, this.health_bar.width, this.health_bar.height));
    this.magic_bar = this.addHud(2, 4, "magic_bar");
    this.magic_bar.max_width = this.magic_bar.width;
    this.health_bar.crop(new Phaser.Rectangle(0, 0, this.magic_bar.width, this.magic_bar.height));

    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.camera.follow(this.avatar);
    this.camera.deadzone = new Phaser.Rectangle(Settings.width()/2-5, Settings.height()-1, 10, 0);
}

function update() {
    console.log(this.avatar.x, this.chests.children[0].x);
    this.physics.arcade.overlap(this.avatar, this.chests, function(avatar, chest) {
        avatar.interact(chest);
    });
    this.health_bar.cropRect.width = Math.ceil(this.health_bar.max_width*this.avatar.health.current/this.avatar.health.max);
    this.health_bar.updateCrop();
}

function render() {
    this.game.pixel.render(this.game);
}

function addHud(x, y, key) {
    var hud = this.add.sprite(0, 0, key);
    hud.fixedToCamera = true;
    hud.cameraOffset.setTo(x, y);
    return hud;
}

module.exports = PlayState;
