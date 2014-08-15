var World = require("./ecs/world");
var $ = require("jquery");

function Sprite() {
    this.walk = [];
    this.stand = [];
    
};
Sprite.componentName = function() {
    return "Sprite";
};

function Position() {
    this.x = 0;
    this.y = 0;
};
Position.componentName = function() {
    return "Position";
};

var SpriteAnimator = {};
SpriteAnimator.systemName = function() {
    return "SpriteAnimator";
};
SpriteAnimator.getAspect = function() {
    return [Sprite, Position];
};

var world = new World();

var img = new Image();

img.onload = function() {

};
img.src = "images/spritesheet.png";

$(document).ready(function() {
    $("body").append(img);
});