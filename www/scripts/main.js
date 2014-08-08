var World = require("./ecs/world");
var $ = require("jquery");

var world = new World();

var img = new Image();

img.src = "images/spritesheet.png";

$(document).ready(function() {
    $("body").append(img);
});