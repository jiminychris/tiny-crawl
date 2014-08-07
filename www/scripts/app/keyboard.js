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

        /*$(MainView.camera.dom()).mousedown(mouseDown);
        $(MainView.camera.dom()).mouseup(mouseUp);*/
        MainView.camera.dom().addEventListener("touchstart", touchDown);
        MainView.camera.dom().addEventListener("touchend", touchUp);

        function mouseDown(e) {
            down(e.offsetX, e.offsetY);
        }
        function mouseUp(e) {
            up(e.offsetX, e.offsetY);
        }function touchDown(e) {
            down(e.targetTouches[0].pageX-MainView.camera.dom().offsetLeft, e.targetTouches[0].pageY-MainView.camera.dom().offsetTop);
        }
        function touchUp(e) {
            console.log(e);
            up(e.changedTouches[0].pageX-MainView.camera.dom().offsetLeft, e.changedTouches[0].pageY-MainView.camera.dom().offsetTop);
        }

        function down(x, y) {
            var width = MainView.camera.width();
            if (x < width/3 && that._down["LEFT"] === undefined) {
                listener.handleLeftDown();
                that._down["LEFT"] = true;
            }
            else if (x > width*2/3 && that._down["RIGHT"] === undefined) {
                listener.handleRightDown();
                that._down["RIGHT"] = true;
            }
        }
        function up(x, y) {
            console.log(that._down);
            var width = MainView.camera.width();
            if (that._down["LEFT"] === true) {
                listener.handleLeftUp();
                that._down["LEFT"] = undefined;
            }
            else if (that._down["RIGHT"] === true) {
                listener.handleRightUp();
                that._down["RIGHT"] = undefined;
            }
        }
    };

    var keyboard = new Keyboard();

    return keyboard;
});