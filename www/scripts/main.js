var Phaser = require("phaser");
var Settings = require("./settings");
var Boot = require("./state/boot");
var $ = require("jquery");

$(document).ready(function() {
    var game = new Phaser.Game(Settings.width(), Settings.height(),
        Phaser.CANVAS, $("#game-container").get(0), Boot);
});
