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
    var screenDivs = $("div#screen");
    if (screenDivs.length != 1)
    {
        // TO-DO error
    }
    else
    {
        var scale = 3;
        var margin = 1;
        var canvasWidth = 88;
        var canvasHeight = 31;
        var width = canvasWidth - margin*2;
        var height = canvasHeight - margin*2;
        var screenDiv = screenDivs.first();
        var canvas = newCanvas(canvasWidth*scale, canvasHeight*scale);
        screenDiv.append(canvas);
        var context = canvas.getContext("2d");
        context.fillStyle = "#000000";
        var gameScreen = newCanvas(width, height);
        gameScreen.getContext("2d").fillStyle = "#000000";

        context.fillStyle = "#000000"
        context.fillRect(0, 0, canvas.width, canvas.height);
        var img = new Image;
        img.onload = function() {
            var wallTile = newCanvas(8, 8);
            var floorTile = newCanvas(24, 6);
            var menuTile = newCanvas(8, 8);
            var wall = newCanvas(width, height-6);
            var floor = newCanvas(width, 6);
            var menu = newCanvas(width, 8);
            var maximAnimation = [];
            var skeletonAnimation = [];
            function tick(i)
            {
                var ctx = gameScreen.getContext("2d");
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(wall, 0, 0);
                ctx.drawImage(floor, 0, gameScreen.height-floor.height);
                ctx.drawImage(maximAnimation[i], 0, gameScreen.height-26);
                ctx.drawImage(skeletonAnimation[i], 52, gameScreen.height-26);
                ctx.drawImage(menu, 0, 0);

                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(gameScreen, 0, 0, gameScreen.width, gameScreen.height,
                    margin*scale, margin*scale, gameScreen.width*scale, gameScreen.height*scale);

                setTimeout(function() { tick((i+1)%4) }, 250);
            }
            wallTile.getContext("2d").drawImage(img, 0, 0, 8, 8, 0, 0, 8, 8);
            floorTile.getContext("2d").drawImage(img, 16, 0, 24, 6, 0, 0, 24, 6);
            menuTile.getContext("2d").drawImage(img, 8, 0, 8, 8, 0, 0, 8, 8);

            for (var i=0; i<4; i++)
            {
                var sprite = newCanvas(26, 26);
                sprite.getContext("2d").drawImage(img, 26*(i+1), 8, 26, 26, 0, 0, 26, 26);
                
                maximAnimation.push(sprite);
            }
            for (var i=0; i<4; i++)
            {
                var sprite = newCanvas(26, 26);
                var ctx = sprite.getContext("2d");
                ctx.translate(sprite.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 26*(i+1), 34, 26, 26, 0, 0, 26, 26);
                
                skeletonAnimation.push(sprite);
            }

            for (var j=wall.height-wallTile.height; j>-wall.height; j-=wallTile.height)
                for (var i=0; i<wall.width; i+=wallTile.width)
                    wall.getContext("2d").drawImage(wallTile, i, j);
            for (var i=0; i<floor.width; i+=floorTile.width)
                floor.getContext("2d").drawImage(floorTile, i, 0);
            for (var i=0; i<menu.width; i+= menuTile.width)
                menu.getContext("2d").drawImage(menuTile, i, 0);
            tick(0);
        };
        img.src = "images/spritesheet.png";
    }
});