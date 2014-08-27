var Phaser = require("phaser");

var Avatar = function (game, x, y, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.health = { max: 10, current: 10 };
    this.inventory = [];
    this.orientation = "right";
    this.cursors = game.input.keyboard.createCursorKeys();

    this.anchor.setTo(0.5, 1);

    game.add.existing(this);

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
        this.orientation = "left";
        this.animations.play("left");
    }
    else if (this.cursors.right.isDown && !this.cursors.left.isDown)
    {
        this.body.velocity.x = 14;
        this.orientation = "right";
        this.animations.play("right");
    }
    else
    {
        this.animations.stop();
        if (this.orientation == "left")
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
        this.inventory.push(chest.contents);
        chest.contents = null;
    }
}

module.exports = Avatar;