define(["jiminychris/Exception"], function (Exception) {
    function Thickness() {
        var n = arguments.length;
        if (n === 0)
            fromNumber(this, 0);
        else if (n === 1)
            fromNumber(this, arguments[0]);
        else if (n === 2)
            from2dArray(this, arguments);
        else if (n === 4)
            from4dArray(this, arguments);
        else
            throw new Exception("Expected 0, 1, 2, or 4 arguments, got " + n.toString());
    };

    Thickness.prototype.toString = function() {
        return this.top + "px " + this.right + "px " + this.bottom + "px " + this.left + "px";
    }

    function from2dArray(thickness, a) {
        if (a.length !== 2)
            throw new Exception("expected 2d array");
        var vertical = a[0],
            horizontal = a[1];
        if (!(typeof vertical === "number"
            && typeof horizontal == "number"))
            throw new Exception("expected numbers");
        thickness.top = thickness.bottom = vertical;
        thickness.left = thickness.right = horizontal;
    };

    function from4dArray(thickness, a) {
        if (a.length !== 4)
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
        thickness.top = top;
        thickness.right = right;
        thickness.bottom = bottom;
        thickness.left = left;
    };

    function fromNumber(thickness, n) {
        if (!(typeof n === "number"))
            throw new Exception("expected number");
        thickness.top = thickness.right = thickness.bottom = thickness.left = n
    }

    Thickness.prototype.constructor = Thickness;

    return Thickness;
});