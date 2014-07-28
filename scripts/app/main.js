define(["jquery"], function($) {
    var canvases = $("canvas#screen");
    if (canvases.length != 1)
    {
        // TO-DO error
    }
    else
    {
        var canvas = canvases[0];
        var context = canvas.getContext("2d");
        context.fillStyle = "#00ff00";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
});