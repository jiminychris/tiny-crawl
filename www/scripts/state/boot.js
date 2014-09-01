var Phaser = require("phaser");
var Settings = require("../settings");
var Preload = require("./preload");
var Play = require("./play");
var Inventory = require("./inventory");
var $ = require("jquery");

require("../plugins/Embiggen");

var Boot = function() {
};

Boot.prototype = {
    init: init,
    create: create
}

function init() {
    this.game.renderer.renderSession.roundPixels = true;
}

function create() {
    var self = this;

    var scale = Math.floor(window.innerWidth/Settings.width());
    var container = $(this.game.parent).height(Settings.height()*scale)
        .width(Settings.width()*scale)
        .css("border", (Settings.borderThickness()*scale).toString() + "px solid black");
    this.game.plugins.add(Phaser.Plugin.Embiggen, scale);

    this.state.add("Preload", Preload);
    this.state.add("Play", Play);
    this.state.add("Inventory", Inventory);
    self.state.start("Preload");
}

module.exports = Boot;
