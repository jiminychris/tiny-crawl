define(["!domReady"], function() {
    function Keyboard() {
        this._listeners = [];
        this._down = {};
    }

    Keyboard.prototype.register = function(listener) {
        this._listeners.push(listener);
        var that = this;
        document.addEventListener("keydown", function(e) {
            if (that._down[e.keyCode] === undefined)
            {
                that._down[e.keyCode] = true;
                listener.handleDown(e);
            }
        });
        document.addEventListener("keyup", function(e) {
            that._down[e.keyCode] = undefined;
            listener.handleUp(e);
        });
    };

    var keyboard = new Keyboard();

    return keyboard;
});