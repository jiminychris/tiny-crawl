(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function World() {
    this._deletedEntityStack = [];
    this._entities = [];
    this._entityIdStream = function() {
        var id;
        if (this._deletedEntityStack > 0)
            id = this._deletedEntityStack.pop();
        else
            id = this._entities.length;
        return id;
    };
}

World.prototype.createEntity = function() {
    var id = this._entityIdStream();
    this._entities[id] = 1;
    return id;
};

World.prototype.killEntity = function(id) {
    this._deletedEntityStack.push(id);
    this._entities[id] = null;
};

module.exports = World;
},{}],2:[function(require,module,exports){
var World = require("./ecs/world");

var world = new World();
},{"./ecs/world":1}]},{},[2]);
