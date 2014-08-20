var Messages = require("./messages");
var _ = require("underscore");

var KeyboardPlayInput = {
    _listeners: [],
    _send: function(message) {
        _.each(this._listeners, function(listener) {
            listener.receive(message);
        });
    },
    register: function(actor) {
        this._listeners.push(actor);
    },
    attach: function(control) {
        downedKeys = {};
        control.attr("tabindex", 0);
        var self = this;

        control.keydown(function(e) {
            switch(e.keyCode) {
                case 37:
                    if (!_.has(downedKeys, e.keyCode))
                    {
                        if (downedKeys[39]) {
                            self._send(Messages.Stop);
                        }
                        else
                            self._send(Messages.WalkLeft);
                        downedKeys[e.keyCode] = true;
                    }
                    break;
                case 39:
                    if (!_.has(downedKeys, e.keyCode))
                    {
                        if (downedKeys[37]) {
                            self._send(Messages.Stop);
                        }
                        else
                            self._send(Messages.WalkRight);
                        downedKeys[e.keyCode] = true;
                    }
                    break;
            }
        });
        control.keyup(function(e) {
            switch(e.keyCode) {
                case 37:
                    if (downedKeys[e.keyCode] === true)
                    {
                        if (downedKeys[39]) {
                            self._send(Messages.WalkRight);
                        }
                        else
                            self._send(Messages.Stop);
                        delete downedKeys[e.keyCode];
                    }
                    break;
                case 39:
                    if (downedKeys[e.keyCode] === true)
                    {
                        if (downedKeys[37]) {
                            self._send(Messages.WalkLeft);
                        }
                        else
                            self._send(Messages.Stop);
                        delete downedKeys[e.keyCode];
                    }
                    break;
            }
        });

        return control;
    }
};

module.exports = KeyboardPlayInput;