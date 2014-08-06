define(["jiminychris/glue/Thickness", "jiminychris/glue/controls/Decorator"], function (Thickness, Decorator) {
    function Border() {
        Decorator.call(this);

        this._border = document.createElement("div");
        this._border.style.borderStyle = "solid";

        this.thickness(new Thickness(1));
        this.color("black");
    };

    Border.prototype = Object.create(Decorator.prototype);
    Border.prototype.constructor = Border;

    Border.prototype.thickness = function() {
        if (arguments.length === 0)
            return this._thickness;
        this._thickness = arguments[0];
        this._border.style.borderWidth = this._thickness.toString();
    };

    Border.prototype.color = function() {
        if (arguments.length === 0)
            return this._color;
        this._color = arguments[0];
        this._border.style.borderColor = this._color;
    };

    Border.prototype.child = function() {
        if (arguments.length === 0)
            return this._child;
        this._child = arguments[0];
        this._border.appendChild(this._child.dom());
    };

    Border.prototype.width = function() {
        if (arguments.length === 0)
            return this._width;
        this._width = arguments[0];
        if (this._width === "stretch")
            this._border.style.width = "100%";
        else
            this._border.style.width = this._width.toString() + "px";
    }

    Border.prototype.height = function() {
        if (arguments.length === 0)
            return this._height;
        this._height = arguments[0];
        if (this._height === "stretch")
            this._border.style.height = "100%";
        else
            this._border.style.height = this._height.toString() + "px";
    }

    Border.prototype.render = function(ds)
    {
        Decorator.prototype.render.call(this, ds);
    };

    Border.prototype.dom = function()
    {
        return this._border;
    };

    return Border;
});