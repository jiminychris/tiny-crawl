var _ = require("underscore");

function Messages() {
    return _.object(arguments, arguments);
}
var Intents = Messages("Stop", "WalkLeft", "WalkRight");

module.exports = Intents;