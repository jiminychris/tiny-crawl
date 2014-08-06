define(["jiminychris/glue/Element"], function (Element) {
    function Menu() {
        Element.call(this);

        this._div = document.createElement("div");
        this._div.style.background = "#323232";
    };

    Menu.prototype = Object.create(Element.prototype);
    Menu.prototype.constructor = Menu;

    Menu.prototype.addChild = function() {
        if (arguments.length === 0)
            return this._child;
        this._child = arguments[0];
        this._div.appendChild(this._child);
    };

    Menu.prototype.width = function() {
        if (arguments.length === 0)
            return this._width;
        this._width = arguments[0];
        if (this._width === "stretch")
            this._div.style.width = "100%";
        else
            this._div.style.width = this._width.toString() + "px";
    }

    Menu.prototype.height = function() {
        if (arguments.length === 0)
            return this._height;
        this._height = arguments[0];
        if (this._height === "stretch")
            this._div.style.height = "100%";
        else
            this._div.style.height = this._height.toString() + "px";
    }

    Menu.prototype.render = function(ds)
    {
    };

    Menu.prototype.dom = function()
    {
        return this._div;
    };

    return Menu;
});