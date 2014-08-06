define(["jquery", "app/Settings", "app/Camera", "jiminychris/glue/controls/Menu",
    "jiminychris/glue/controls/Border", "jiminychris/glue/Thickness", "jiminychris/glue/controls/Panel",
    "app/World",
    "domReady!"],
    function($, Settings, Camera, Menu, Border, Thickness, Panel, World) {

    var menu = new Menu();
    var menuBorder = new Border();
    menuBorder.thickness(new Thickness(0, 0, Settings.margin(), 0));
    menuBorder.width("stretch");
    menuBorder.height(Settings.menuHeight());
    menuBorder.color("black");
    menuBorder.child(menu);

    var camera = new Camera(Settings.width(), Settings.height());

    var panel = new Panel();
    panel.addChild(camera);
    panel.addChild(menuBorder);

    var border = new Border();
    border.thickness(new Thickness(Settings.margin()));
    border.color("black");
    border.child(panel);
    border.width(Settings.width());
    border.height(Settings.height());


    var containers = $("div#game-container");
    if (containers.length !== 1)
    {
        // TO-DO error
    }
    else
    {
        containers.first().append(border.dom());


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
        var width = 86;
        var height = 31;
        var img = new Image;
        img.onload = function() {
            var wallTile = newCanvas(8, 8);
            var floorTile = newCanvas(24, 6);
            var wall = newCanvas(width, height-6);
            var floor = newCanvas(width, 6);
            var maximAnimation = [];
            var skeletonAnimation = [];
            function tick(lastTime)
            {
                var currentTime = Date.now()
                var ds = (currentTime - lastTime)/1000;
                border.render(ds);

                setTimeout(function() { tick(currentTime) }, 10);
            }
            wallTile.getContext("2d").drawImage(img, 0, 0, 8, 8, 0, 0, 8, 8);
            floorTile.getContext("2d").drawImage(img, 16, 0, 24, 6, 0, 0, 24, 6);

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

            camera.wall = wall;
            camera.floor = floor;
            camera.maximAnimation = maximAnimation;
            camera.skeletonAnimation = skeletonAnimation;
            tick(Date.now());
        };
        img.src = "images/spritesheet.png";
    }
});