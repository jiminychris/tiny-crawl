define(["jiminychris/glue/Element"], function (Element) {
    function Panel() {
        Element.call(this);

        this._children = [];
        this._div = document.createElement("div");
        this._div.className = "panel";
    };

    Panel.prototype = Object.create(Element.prototype);
    Panel.prototype.constructor = Panel;

    Panel.prototype.addChild = function() {
        if (arguments.length === 0)
            return this._children;
        this._children.push(arguments[0]);
        this._div.appendChild(arguments[0].dom());
    };

    Panel.prototype.width = function() {
        if (arguments.length === 0)
            return this._width;
        this._width = arguments[0];
        this._div.style.width = this._width;
    }

    Panel.prototype.height = function() {
        if (arguments.length === 0)
            return this._height;
        this._height = arguments[0];
        this._div.style.height = this._height;
    }

    Panel.prototype.render = function(ds) {
        for (var i=0; i<this._children.length; i++)
            this._children[i].render(ds);
    };

    Panel.prototype.dom = function()
    {
        return this._div;
    };

    return Panel;
});