define(["app/keyboard"], function(Keyboard) {
    function World() {
        var avatar = {
            x: 0,
            dx: 0,
            maxSpeed: 3,
            handleLeftDown: function() {
                avatar.dx += -avatar.maxSpeed;
            },
            handleLeftUp: function() {
                avatar.dx += avatar.maxSpeed;
            },
            handleRightDown: function() {
                avatar.dx += avatar.maxSpeed;
            },
            handleRightUp: function() {
                avatar.dx += -avatar.maxSpeed;
            }
        };

        Keyboard.register(avatar);

        this.avatar = avatar;
    }

    var world = new World();

    function tick(lastTime) {
        var currentTime = Date.now();
        var ds = (currentTime - lastTime)/1000;
        world.avatar.x += world.avatar.dx * ds;

        setTimeout(function() { tick(currentTime) }, 10);
    }

    tick(Date.now());

    return world;
});