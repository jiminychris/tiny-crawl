define(["jquery"], function($) {
    var canvases = $("canvas#screen");
    if (canvases.length != 1)
    {
        // TO-DO error
    }
    else
    {
        var scale = 3;
        var canvas = canvases[0];
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
            var wall = document.createElement("canvas");
            wall.width = canvas.width - 2*scale;
            wall.height = canvas.height - 2*scale;
            wallContext = wall.getContext("2d");

            wallContext.webkitImageSmoothingEnabled = false;
            wallContext.mozImageSmoothingEnabled = false;
            wallContext.imageSmoothingEnabled = false; /// future

            for (var j=0; j<wall.height; j+=img.height*scale)
                for (var i=0; i<wall.width; i+=img.width*scale)
                    wallContext.drawImage(img, i, j,
                        img.width*scale, img.height*scale);
            context.drawImage(wall, scale, scale)
        };
        img.src = "images/DungeonWallpaper.png";
    }
});