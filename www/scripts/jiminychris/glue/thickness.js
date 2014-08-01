define(["jiminychris/Exception"], function (Exception) {
    function Thickness() {
        this.top = 0.0;
        this.right = 0.0;
        this.bottom = 0.0;
        this.left = 0.0;
    };

    Thickness.from2dArray = function(a) {
        if (a.length != 2)
            throw new Exception("expected 2d array");
        var vertical = a[0],
            horizontal = a[1];
        if (!(typeof vertical === "number"
            && typeof horizontal == "number"))
            throw new Exception("expected numbers");
        var thickness = new Thickness();
        thickness.top = thickness.bottom = vertical;
        thickness.left = thickness.right = horizontal;
        return thickness;
    };

    Thickness.from4dArray = function(a) {
        if (a.length != 4)
            throw new Exception("expected 4d array");
        var top = a[0],
            right = a[1],
            bottom = a[2],
            left = a[3];
        if (!(typeof top === "number" 
            && typeof right === "number"
            && typeof bottom == "number"
            && typeof left == "number"))
            throw new Exception("expected numbers");
        var thickness = new Thickness();
        thickness.top = top;
        thickness.right = right;
        thickness.bottom = bottom;
        thickness.left = left;
        return thickness;
    };

    Thickness.fromNumber = function(n) {
        if (!(typeof n === "number"))
            throw new Exception("expected number");
        var thickness = new Thickness();
        thickness.top = thickness.right = thickness.bottom = thickness.left = n
        return thickness;
    }

    return Thickness;
});