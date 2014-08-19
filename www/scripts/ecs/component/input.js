var Component = require("./component");

var Input = Component("Input", function() {
    this._messages = [];
    this._source = null;
});

Input.prototype.messages = function() {
    if (arguments.length === 0)
        return this._messages;
    this._messages = arguments[0];
};

Input.prototype.source = function() {
    if (arguments.length === 0)
        return this._source;
    this._source = arguments[0];
    var self = this;
    this._source.register(function(message) {
        self._messages.push(message);
    })
};

module.exports = Input;