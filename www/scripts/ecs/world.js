var _ = require("underscore");
var Exception = require("../exception");

function World() {
    this._entityCount = 0;
    this._componentTypeCount = 0;

    this._killedEntityStack = [];
    this._components = [];
    this._componentTypeRegistry = {};

    this._entityIdStream = function() {
        var id;
        if (this._killedEntityStack > 0)
            return this._killedEntityStack.pop();
        id = this._entityCount;
        this._entityCount += 1;
        return id;
    };
    this._componentTypeIdStream = function() {
        var id = this._componentTypeCount;
        this._componentTypeCount += 1;
        return id;
    };
}

World.prototype.createEntity = function() {
    return this._entityIdStream();
};

World.prototype.killEntity = function(entity) {
    this._validateEntity(entity);
    this._killedEntityStack.push(entity);
    for (var i=0; i<this._componentTypeCount; i++)
        this._components[i][entity] = null;
};

World.prototype.addComponent = function(entity, component) {
    this._validateEntity(entity);
    this._components[this._getComponentId(component)][entity] = component;
};

World.prototype.fetchComponent = function(entity, componentName) {
    this._validateEntity(entity);
    try
    {
        this._validateComponentName(componentName);
        return this._components[this._componentTypeRegistry[componentName]][entity];
    } catch(e) {
        return null;
    }
};

World.prototype._validateEntity = function(entity) {
    if (entity >= this._entityCount || _.contains(this._killedEntityStack, entity))
        throw new Exception("entity '" + entity + "' does not exist");
};

World.prototype._validateComponentName = function(componentName) {
    if (!_.has(this._componentTypeRegistry, componentName))
        throw new Exception("component name '" + componentName + "' does not exist");
};

World.prototype._getComponentId = function(component) {
    var name = component.constructor.componentName();
    if (!_.has(this._componentTypeRegistry, name))
    {
        var id = this._componentTypeIdStream();
        this._componentTypeRegistry[name] = id;
        this._components[id] = [];
    }
    return this._componentTypeRegistry[name];
}

module.exports = World;
