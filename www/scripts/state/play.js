var Phaser = require("phaser");
var Avatar = require("../avatar");
var Chest = require("../chest");
var Orientation = require("../orientation");
var _ = require("underscore");

var Play = function(game) {
    this.avatars = {};
    this.avatar = null;
    this.health_bar = null;
    this.magic_bar = null;
    this.chests = null;
    this.memento = null;
    this.data = null;
};

Play.prototype = {
    init: init,
    create: create,
    update: update,
    addHud: addHud
}

function init(data) {
    this.data = this.data === null ? data : this.data;
}

function create() {
    var game = this.game;
    var self = this;

    var map = game.add.tilemap("map");
    map.addTilesetImage("dungeon");
    map.addTilesetImage("chest");
    var layer = map.createLayer("Tile Layer 1");
    layer.resizeWorld();

    this.chests = game.add.group();
    this.chests.enableBody = true;
    
    map.createFromObjects("Object Layer 1", 5, "chest", 0, true, false, this.chests, Chest);

    this.game.io.on('avatar update', function(avatars) {
        _.each(avatars, function(avatar) {
            var dx = avatar.x - self.avatars[avatar.id].x;
            self.avatars[avatar.id].x += dx * .5;
        });
    });
    this.game.io.on('avatar move', function(data) {
        self.avatars[data.id].move(data.direction);
    });
    this.game.io.on('avatar stop', function(data) {
        self.avatars[data.id].stop();
    });
    this.game.io.on('player join', function(avatar) {
        self.avatars[avatar.id] = new Avatar(self.game, avatar.x, self.game.height-1, "maxim", 0)
    });
    this.game.io.on('player leave', function(id) {
        self.avatars[id].destroy();
        delete self.avatars[id];
    });

    game.input.onDown.add(function(pointer) {
        var x = pointer.x / this.game.width;
        if (x < .2)
            this.game.io.emit('avatar move', {timestamp: Date.now(), direction: Orientation.Left});
        if (x > .8)
            this.game.io.emit('avatar move', {timestamp: Date.now(), direction: Orientation.Right});
    }, this);
    game.input.onUp.add(function() {
        this.game.io.emit('avatar stop', {timestamp: Date.now()});
    }, this);

    var cursors = this.game.input.keyboard.createCursorKeys();

    cursors.left.onDown.add(function() {
        if (!cursors.right.isDown)
            this.game.io.emit('avatar move', {timestamp: Date.now(), direction: Orientation.Left});
        else
            this.game.io.emit('avatar stop', {timestamp: Date.now()});
    }, this);
    cursors.right.onDown.add(function() {
        if (!cursors.left.isDown)
            this.game.io.emit('avatar move', {timestamp: Date.now(), direction: Orientation.Right});
        else
            this.game.io.emit('avatar stop', {timestamp: Date.now()});
    }, this);
    cursors.left.onUp.add(function() {
        if (cursors.right.isDown)
            this.game.io.emit('avatar move', {timestamp: Date.now(), direction: Orientation.Right});
        else
            this.game.io.emit('avatar stop', {timestamp: Date.now()});
    }, this);
    cursors.right.onUp.add(function() {
        if (cursors.left.isDown)
            this.game.io.emit('avatar move', {timestamp: Date.now(), direction: Orientation.Left});
        else
            this.game.io.emit('avatar stop', {timestamp: Date.now()});
    }, this);

    _.each(this.data.avatars, function(avatar) {
        self.avatars[avatar.id] = new Avatar(self.game, avatar.x, self.game.height-1, "maxim", 0);
    });
    self.avatar = self.avatars[this.data.id];
    self.camera.follow(self.avatar);

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
