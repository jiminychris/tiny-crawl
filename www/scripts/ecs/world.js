var Exception = require("../exception");

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

World.prototype.killEntity = function(entity) {
    this._deletedEntityStack.push(entity);
    this._entities[entity] = null;
};

World.prototype.addComponent = function(entity, component) {
    if (this._entities[entity] === null)
        throw new Exception("entity '" + entity + "' does not exist");

};

module.exports = World;
