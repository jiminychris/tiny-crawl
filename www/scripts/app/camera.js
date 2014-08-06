define(["app/Settings", "app/World"], function(Settings, World) {
    function Camera(width, height) {
        this._width = width;
        this._height = height;

        this._ticker = 0;
        this._i = 0;

        this._canvas = newCanvas(this._width, this._height);

        this._context = this._canvas.getContext("2d");
        this._context.fillStyle = "#00ff00";
    }

    Camera.prototype.render = function(ds) {
        this._ticker += ds;
        if (this._ticker > .25)
        {
            this._ticker = 0;
            this._i = (this._i + 1) % 4;
        }

        var c = newCanvas(86, 31)
        var ctx = c.getContext("2d");
        ctx.fillRect(0, 0, this._width, this._height);
        ctx.drawImage(this.wall, 0, 0);
        ctx.drawImage(this.floor, 0, c.height-this.floor.height);
        ctx.drawImage(this.maximAnimation[this._i], World.avatar.x*Settings.pixelsPerMeter()-this.maximAnimation[this._i].width/2, c.height-26);
        ctx.drawImage(this.skeletonAnimation[this._i], 52, c.height-26);

        this._context.drawImage(c, 0, 0, c.width, c.height, 0, 0, this._width, this._height);
    };

    Camera.prototype.dom = function() {
        return this._canvas;
    };

    function newCanvas(width, height)
    {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false; /// future
        return canvas;
    }

    return Camera;
});