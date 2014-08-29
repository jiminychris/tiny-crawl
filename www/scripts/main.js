var Phaser = require("phaser");
var Settings = require("./settings");
var BootState = require("./bootstate");

var game = new Phaser.Game(Settings.width(), Settings.height(),
    Phaser.CANVAS, "", BootState);
