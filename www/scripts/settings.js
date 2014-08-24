var width = 88;
var height = 31;
var borderThickness = 1;
var scale = 10;
var pixelsPerMeter = 10;
var metersPerPixel = 1 / pixelsPerMeter;

module.exports.width = function() { return width; };
module.exports.height = function() { return height; };
module.exports.scale = function() { return scale; };
module.exports.borderThickness = function() { return borderThickness; };
module.exports.pixelsPerMeter = function() { return pixelsPerMeter; };
module.exports.metersPerPixel = function() { return metersPerPixel; };