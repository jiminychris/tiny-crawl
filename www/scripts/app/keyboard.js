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
            down(e.targetTouches[0].pageX-getOffsetLeft(MainView.camera.dom()), e.targetTouches[0].pageY-getOffsetTop(MainView.camera.dom()));
        }
        function touchUp(e) {
            up(e.changedTouches[0].pageX-getOffsetLeft(MainView.camera.dom()), e.changedTouches[0].pageY-getOffsetTop(MainView.camera.dom()));
        }

        function down(x, y) {
            var width = MainView.camera.width();
            console.log(x, width, width/3, width*2/3);
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

        function getOffsetLeft(elem) {
            var offsetLeft = 0;
            do {
              if ( !isNaN( elem.offsetLeft ) )
              {
                  offsetLeft += elem.offsetLeft;
              }
            } while( elem = elem.offsetParent );
            return offsetLeft;
        }

        function getOffsetTop(elem) {
            var offsetTop = 0;
            do {
              if ( !isNaN( elem.offsetTop ) )
              {
                  offsetTop += elem.offsetTop;
              }
            } while( elem = elem.offsetParent );
            return offsetTop;
        }
    };

    var keyboard = new Keyboard();

    return keyboard;
});