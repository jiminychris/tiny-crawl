var Phaser = require("phaser");
var Settings = require("./settings");
var PreloadState = require("./preloadstate");
var PlayState = require("./playstate");
var $ = require("jquery");

require("./plugins/Embiggen");

var BootState = function() {
};

BootState.prototype = {
    init: init,
    create: create
}

function init() {
    this.game.renderer.renderSession.roundPixels = true;
}

function create() {
    /*var container = $(this.game.parent).height(Settings.height()*Settings.scale())
        .width(Settings.width()*Settings.scale())
        .css("border", (Settings.borderThickness()*Settings.scale()).toString() + "px solid black");*/
    this.game.plugins.add(Phaser.Plugin.Embiggen, Math.floor(window.innerWidth/Settings.width()));

    this.state.add("Preload", PreloadState);
    this.state.add("Play", PlayState);

    this.state.start("Preload");
}

module.exports = BootState;
