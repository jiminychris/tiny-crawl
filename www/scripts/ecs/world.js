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