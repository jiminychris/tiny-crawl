define(function () {
    return function Element() {
        this._width = null;
        this._height = null;
    };

    Element.prototype.render = function() { }

    Element.prototype.constructor = Element;

    return Element;
});