var Phaser = require("phaser");
var Avatar = require("../avatar");
var Chest = require("../chest");
var _ = require("underscore");

var Play = function(game) {
    this.avatar = null;
    this.health_bar = null;
    this.magic_bar = null;
    this.chests = null;
    this.memento = null;
};

Play.prototype = {
    init: init,
    create: create,
    update: update,
    addHud: addHud
}

function init() {
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

    this.avatar = new Avatar(game, 8, game.height, "maxim", 0);

    if (this.memento !== null)
    {
        this.avatar.x = this.memento.avatar.x;
        this.avatar.y = this.memento.avatar.y;
        this.avatar.health.current = this.memento.avatar.health.current;
        _.each(_.zip(this.chests.children, this.memento.chests), function(chest) {
            chest[0].contents = chest[1].contents;
            chest[0].frame = chest[1].frame;
        });
    }


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
    this.camera.deadzone = new Phaser.Rectangle(game.width/2-5, game.height-1, 10, 0);
}

function update() {
    if (this.input.keyboard.isDown(Phaser.Keyboard.I))
    {
        var avatar = this.avatar;
        var chests = this.chests;
        this.memento = {
            avatar: avatar,
            chests: _.map(chests.children, function(chest) {
                return { frame: chest.frame, contents: chest.contents };
            })
        }
        this.state.start("Inventory", avatar);
    }
    this.physics.arcade.overlap(this.avatar, this.chests, function(avatar, chest) {
        avatar.interact(chest);
    });
    this.health_bar.cropRect.width = Math.ceil(this.health_bar.max_width*this.avatar.health.current/this.avatar.health.max);
    this.health_bar.updateCrop();
}

function addHud(x, y, key) {
    var hud = this.add.sprite(0, 0, key);
    hud.fixedToCamera = true;
    hud.cameraOffset.setTo(x, y);
    return hud;
}

module.exports = Play;
