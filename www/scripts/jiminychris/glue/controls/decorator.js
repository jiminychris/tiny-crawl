define(["jiminychris/glue/Element"], function (Element) {
    function Decorator() {
        Element.call(this);
        this._child = null;
    };

    Decorator.prototype = Object.create(Element.prototype);
    Decorator.prototype.constructor = Decorator;

    Decorator.prototype.render = function(ds) {
        this._child.render(ds);
    }

    return Decorator;
});