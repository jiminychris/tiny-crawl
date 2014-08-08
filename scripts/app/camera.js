define([], function() {
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
    };

    Camera.prototype.dom = function() {
        return this._canvas;
    };    

    Camera.prototype.width = function() {
        if (arguments.length === 0)
            return this._width;
        this._width = arguments[0];
        if (this._width === "stretch")
            this._canvas.style.width = "100%";
        else
            this._canvas.style.width = this._width.toString() + "px";
    }

    Camera.prototype.height = function() {
        if (arguments.length === 0)
            return this._height;
        this._height = arguments[0];
        if (this._height === "stretch")
            this._canvas.style.height = "100%";
        else
            this._canvas.style.height = this._height.toString() + "px";
    }

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