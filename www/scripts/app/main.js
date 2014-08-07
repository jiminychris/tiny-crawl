define(["app/mainview", "app/world", "app/Settings"], function(MainView, World, Settings) {
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

    MainView.camera.render = function(ds) {
        //var this = MainView.camera;
        this._ticker += ds;
        if (this._ticker > .25)
        {
            this._ticker = 0;
            this._i = (this._i + 1) % 4;
        }

        var c = newCanvas(86, 29)
        var ctx = c.getContext("2d");
        ctx.fillRect(0, 0, this._width, this._height);
        ctx.drawImage(this.wall, 0, 0);
        ctx.drawImage(this.floor, 0, c.height-this.floor.height);
        ctx.drawImage(this.maximAnimation[this._i], World.avatar.x*Settings.pixelsPerMeter()-this.maximAnimation[this._i].width/2, c.height-25);
        ctx.drawImage(this.skeletonAnimation[this._i], 52, c.height-25);

        this._context.drawImage(c, 0, 0, c.width, c.height, 0, 0, this._width, this._height);
    }
});