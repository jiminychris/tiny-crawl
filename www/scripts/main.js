var Phaser = require("phaser");
var Settings = require("./settings");
var BootState = require("./bootstate");
var $ = require("jquery");

$(document).ready(function() {
    var game = new Phaser.Game(Settings.width(), Settings.height(),
        Phaser.CANVAS, $("#game-container").get(0), BootState);
});
