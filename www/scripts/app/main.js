define(["jquery"], function($) {
    function newCanvas(width, height)
    {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false; /// future
        return canvas;
    }
    var canvases = $("canvas#screen");
    if (canvases.length != 1)
    {
        // TO-DO error
    }
    else
    {
        var scale = 3;
        var margin = 1;
        var canvas = canvases[0];
        var width = canvas.width;
        var height = canvas.height;
        canvas.width = canvas.width*scale;
        canvas.height = canvas.height*scale;
        var context = canvas.getContext("2d");

        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false; /// future

        context.fillStyle = "#000000"
        context.fillRect(0, 0, canvas.width, canvas.height);
        var img = new Image;
        img.onload = function() {
            var wall = newCanvas(width-2*margin, height-2*margin);
            wallContext = wall.getContext("2d");
            var tile = newCanvas(8, 8);
            tile.getContext("2d").drawImage(img, 0, 0, 8, 8, 0, 0,
                8, 8);

            var walkAnimation = [];
            for (var i=0; i<4; i++)
            {
                var sprite = newCanvas(26, 26);
                
                walkAnimation.push(sprite);
            }

            for (var j=0; j<wall.height; j+=tile.height)
                for (var i=0; i<wall.width; i+=tile.width)
                    wallContext.drawImage(tile, i, j);

            context.drawImage(wall, 0, 0, wall.width, wall.height,
                margin*scale, margin*scale, wall.width*scale, wall.height*scale);
        };
        img.src = "images/spritesheet.png";
    }
});