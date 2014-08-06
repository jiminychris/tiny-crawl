define(["app/Keyboard"], function(Keyboard) {
    function World() {
        var avatar = {
            x: 0,
            dx: 0,
            maxSpeed: 1.4,
            handleDown: function(e) {
                if (e.keyCode === 37)
                    avatar.dx = -avatar.maxSpeed;
                else if (e.keyCode === 39)
                    avatar.dx = avatar.maxSpeed;
            },
            handleUp: function(e) {
                avatar.dx = 0;
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