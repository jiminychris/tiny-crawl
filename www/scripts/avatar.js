var Phaser = require("phaser");
var Orientation = require("./orientation");

var Avatar = function (game, x, y, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.health = { max: 10, current: 10 };
    this.inventory = [];
    this.orientation = Orientation.Right;
    this.cursors = game.input.keyboard.createCursorKeys();

    game.add.existing(this);

    game.physics.arcade.enable(this);

    this.animations.add(Orientation.Left, [1, 2, 3, 4], 4, true);
    this.animations.add(Orientation.Right, [6, 7, 8, 9], 4, true);
    this.anchor.setTo(.5, 1);

};

Avatar.prototype = Object.create(Phaser.Sprite.prototype);
Avatar.prototype.constructor = Avatar;

Avatar.prototype.update = function() {
    var dt = this.game.time.physicsElapsed;

    this.damage(1*dt);


    this.body.velocity.x = 0;

    if (this.cursors.left.isDown && !this.cursors.right.isDown)
    {
        this.body.velocity.x = -14;
        this.orientation = Orientation.Left;
        this.animations.play(Orientation.Left);
    }
    else if (this.cursors.right.isDown && !this.cursors.left.isDown)
    {
        this.body.velocity.x = 14;
        this.orientation = Orientation.Right;
        this.animations.play(Orientation.Right);
    }
    else
    {
        this.animations.stop();
        if (this.orientation === Orientation.Left)
            this.frame = 0;
        else
            this.frame = 5;
    }
    this.x = Number(this.x.toFixed(3));

};

Avatar.prototype.damage = function(amount) {
    this.health.current -= amount;
    if (this.health.current < 0)
        this.health.current = 0;
}

Avatar.prototype.heal = function(amount) {
    this.health.current += amount;
    if (this.health.current > this.health.max)
        this.health.current = this.health.max;
}

Avatar.prototype.interact = function(chest) {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z) && chest.contents !== null)
    {
        this.inventory.push(chest.open());
    }
}

module.exports = Avatar;
