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
            var tile = newCanvas(8, 8);
            var wall = newCanvas(width-2*margin, height-2*margin);
            var walkAnimation = [];
            function tick(i)
            {
                gameScreen = newCanvas(width, height);
                ctx = gameScreen.getContext("2d");
                ctx.drawImage(wall, margin, margin);
                ctx.drawImage(walkAnimation[i], 0, wall.height-26);

                context.drawImage(gameScreen, 0, 0, gameScreen.width, gameScreen.height,
                    0, 0, gameScreen.width*scale, gameScreen.height*scale);

                setTimeout(function() { tick((i+1)%4) }, 250);
            }
            wallContext = wall.getContext("2d");
            tile.getContext("2d").drawImage(img, 0, 0, 8, 8, 0, 0, 8, 8);

            for (var i=0; i<4; i++)
            {
                var sprite = newCanvas(26, 26);
                sprite.getContext("2d").drawImage(img, 26*(i+1), 8, 26, 26, 0, 0, 26, 26);
                
                walkAnimation.push(sprite);
            }

            for (var j=0; j<wall.height; j+=tile.height)
                for (var i=0; i<wall.width; i+=tile.width)
                    wallContext.drawImage(tile, i, j);
            tick(0);
        };
        img.src = "images/spritesheet.png";
    }
});