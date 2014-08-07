define(["jquery", "app/mainview", "domReady!"], function($, MainView) {
    function Keyboard() {
        this._listeners = [];
        this._down = {};
    }

    Keyboard.prototype.register = function(listener) {
        this._listeners.push(listener);
        var that = this;
        document.addEventListener("keydown", function(e) {
            if (e.keyCode === 37 && that._down["LEFT"] === undefined) {
                listener.handleLeftDown();
                that._down["LEFT"] = true;
            }
            else if (e.keyCode === 39 && that._down["RIGHT"] === undefined) {
                listener.handleRightDown();
                that._down["RIGHT"] = true;
            }
        });
        document.addEventListener("keyup", function(e) {
            if (e.keyCode === 37) {
                listener.handleLeftUp();
                that._down["LEFT"] = undefined;
            }
            else if (e.keyCode === 39) {
                listener.handleRightUp();
                that._down["RIGHT"] = undefined
            }
        });

        $(MainView.camera.dom()).mousedown(function(e) {
            var width = MainView.camera.width();
            console.log(e, width);
            if (e.offsetX < width/3 && that._down["LEFT"] === undefined) {
                listener.handleLeftDown();
                that._down["LEFT"] = true;
            }
            else if (e.offsetX > width*2/3 && that._down["RIGHT"] === undefined) {
                listener.handleRightDown();
                that._down["RIGHT"] = true;
            }
        });

        $(MainView.camera.dom()).mouseup(function(e) {
            var width = MainView.camera.width();
            if (that._down["LEFT"] === true) {
                listener.handleLeftUp();
                that._down["LEFT"] = undefined;
            }
            else if (that._down["RIGHT"] === true) {
                listener.handleRightUp();
                that._down["RIGHT"] = undefined;
            }
        });
    };

    var keyboard = new Keyboard();

    return keyboard;
});