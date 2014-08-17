var pixelsPerMeter = 10;
var metersPerPixel = 1 / pixelsPerMeter;

module.exports.pixelsPerMeter = function() { return pixelsPerMeter; };
module.exports.metersPerPixel = function() { return metersPerPixel; };