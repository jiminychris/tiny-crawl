"use strict";

var Phaser = require("phaser");

/**
* A Sample Plugin demonstrating how to hook into the Phaser plugin system.
*/
Phaser.Plugin.Embiggen = function (game, parent) {

    Phaser.Plugin.call(this, game, parent);

    this.scale = null;
    this.canvas = null;
    this.context = null;
    this.width = 0;
    this.height = 0;
    this.visible = true;
};

//  Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.Embiggen.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Embiggen.prototype.constructor = Phaser.Plugin.Embiggen;

/**
* Add a Sprite reference to this Plugin.
* All this plugin does is move the Sprite across the screen slowly.
* @type {Phaser.Sprite}
*/
Phaser.Plugin.Embiggen.prototype.init = function (scale) {

    this.scale = scale;
    this.canvas = Phaser.Canvas.create(this.game.width * scale, this.game.height * scale);
    this.context = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    //  Hide the un-scaled game canvas
    this.game.canvas.style['display'] = 'none';
 
    //  Add the scaled canvas to the DOM
    Phaser.Canvas.addToDOM(this.canvas, this.game.parent);
    Phaser.Canvas.setTouchAction(this.canvas);
 
    //  Disable smoothing on the scaled canvas
    Phaser.Canvas.setSmoothingEnabled(this.context, false);

    var self = this;

    if (this.game.device.touch)
    {
        this._onTouchStart = function (event) {
            return self.game.input.touch.onTouchStart(event);
        };

        this._onTouchMove = function (event) {
            return self.game.input.touch.onTouchMove(event);
        };

        this._onTouchEnd = function (event) {
            return self.game.input.touch.onTouchEnd(event);
        };

        this._onTouchEnter = function (event) {
            return self.game.input.touch.onTouchEnter(event);
        };

        this._onTouchLeave = function (event) {
            return selfgame.input.touch.onTouchLeave(event);
        };

        this._onTouchCancel = function (event) {
            return self.game.input.touch.onTouchCancel(event);
        };

        this.canvas.addEventListener('touchstart', this._onTouchStart, false);
        this.canvas.addEventListener('touchmove', this._onTouchMove, false);
        this.canvas.addEventListener('touchend', this._onTouchEnd, false);
        this.canvas.addEventListener('touchcancel', this._onTouchCancel, false);

        if (!this.game.device.cocoonJS)
        {
            this.canvas.addEventListener('touchenter', this._onTouchEnter, false);
            this.canvas.addEventListener('touchleave', this._onTouchLeave, false);
        }
    }

    this._onMouseDown = function (event) {
        return self.game.input.mouse.onMouseDown(event);
    };

    this._onMouseMove = function (event) {
        return self.game.input.mouse.onMouseMove(event);
    };

    this._onMouseUp = function (event) {
        return self.game.input.mouse.onMouseUp(event);
    };

    this._onMouseOut = function (event) {
        return self.game.input.mouse.onMouseOut(event);
    };

    this._onMouseOver = function (event) {
        return self.game.input.mouse.onMouseOver(event);
    };

    this._onMouseWheel = function (event) {
        return self.game.input.mouse.onMouseWheel(event);
    };

    this.canvas.addEventListener('mousedown', this._onMouseDown, true);
    this.canvas.addEventListener('mousemove', this._onMouseMove, true);
    this.canvas.addEventListener('mouseup', this._onMouseUp, true);
    this.canvas.addEventListener('mousewheel', this._onMouseWheel, true);
    this.canvas.addEventListener('DOMMouseScroll', this._onMouseWheel, true);

    if (!this.game.device.cocoonJS)
    {
        this.canvas.addEventListener('mouseover', this._onMouseOver, true);
        this.canvas.addEventListener('mouseout', this._onMouseOut, true);
    }
    this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

};

Phaser.Plugin.Embiggen.prototype.render = function() {
    this.context.drawImage(this.game.canvas, 0, 0,
        this.game.width, this.game.height, 0, 0, this.width, this.height);
};
