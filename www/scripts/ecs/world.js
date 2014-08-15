var _ = require("underscore");
var Exception = require("../exception");

function World() {
    this._entityCount = 0;
    this._componentTypeCount = 0;
    this._systemCount = 0;

    this._killedEntityStack = [];
    this._activeEntities = [];
    this._components = [];
    this._systems = [];
    this._componentTypeRegistry = {};
    this._componentTypeBitRegistry = {};
    this._systemTypeRegistry = {};
    this._entityAspectBits = [];
    this._systemAspectBits = [];
    this._aspects = [];

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
    this._systemIdStream = function() {
        var id;
        id = this._systemCount;
        this._systemCount += 1;
        return id;
    };
}

World.prototype.createEntity = function() {
    var entity = this._entityIdStream();
    this._entityAspectBits[entity] = 0;
    this._activeEntities.push(entity);
    return entity;
};

World.prototype.killEntity = function(entity) {
    this._validateEntity(entity);
    this._killedEntityStack.push(entity);
    this._activeEntities = _.reject(this._activeEntities, function(e) {
        e === entity;
    }, this);
    for (var i=0; i<this._componentTypeCount; i++)
        this._components[i][entity] = null;
};

World.prototype.addComponent = function(entity, component) {
    this._validateEntity(entity);
    this._components[this._getComponentIdFromInstance(component)][entity] = component;
    this._entityAspectBits[entity] |= this._getComponentBitIdFromName(component.constructor.componentName());
    _.each(this._systems, function(system, i) {
        this._updateAspect(system, entity);
    }, this);
};

World.prototype.fetchComponent = function(entity, componentConstructor) {
    this._validateEntity(entity);
    var componentName = componentConstructor.componentName();
    try
    {
        this._validateComponentName(componentName);
        return this._components[this._getComponentIdFromName(componentName)][entity];
    } catch(e) {
        return null;
    }
};

World.prototype.removeComponent = function(entity, componentConstructor) {
    this._validateEntity(entity);
    var componentName = componentConstructor.componentName();
    this._validateComponentName(componentName);
    this._components[this._getComponentIdFromName(componentName)][entity] = null;
    this._entityAspectBits[entity] &= ~this._getComponentBitIdFromName(componentName);
    _.each(this._systems, function(system) {
        this._updateAspect(system, entity);
    }, this);
};

World.prototype.addSystem = function(system) {
    var i = 0;
    var j = 0;
    var name = system.systemName();
    if (_.has(this._systemTypeRegistry, name))
        throw new Exception("system '" + name + "' has already been added");
    var systemId = this._systemIdStream();
    this._systemTypeRegistry[name] = systemId;
    this._systems[systemId] = system;
    var systemAspectBits = _.reduce(
        _.map(system.getAspect(), function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            return this._getComponentBitIdFromName(componentName);
        }, this),
        function(memo, num) {
            return memo | num;
        },
        0);
    this._systemAspectBits[systemId] = systemAspectBits;
    this._aspects[systemId] = [];
    _.each(this._activeEntities, function(entity, i) {
        this._updateAspect(system, entity);
    }, this);
};

World.prototype.tick = function(dt) {
    _.each(this._systems, function(system, i) {
        system.tick(_.values(this._aspects[i]), dt);
    }, this);
};

World.prototype._updateAspect = function(system, entity) {
    var i = 0;
    var systemName = system.systemName();
    var systemId = this._systemTypeRegistry[systemName];
    var systemAspectBits = this._systemAspectBits[systemId];
    delete this._aspects[systemId][entity];
    if ((systemAspectBits & this._entityAspectBits[entity]) === systemAspectBits)
    {
        var obj = {};
        _.each(system.getAspect(), function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            obj[componentName] = this._components[this._getComponentIdFromName(componentName)][entity];
        }, this);
        this._aspects[systemId][entity] = obj;
    }
}

World.prototype._getEntityAspectBits = function(entity) {
    return this._entityAspectBits[entity];
};

World.prototype._getSystemAspectBits = function(systemId) {
    return this._systemAspectBits[systemId];
};

World.prototype._validateEntity = function(entity) {
    if (entity >= this._entityCount || _.contains(this._killedEntityStack, entity))
        throw new Exception("entity '" + entity + "' does not exist");
};

World.prototype._validateComponentName = function(componentName) {
    if (!_.has(this._componentTypeRegistry, componentName))
        throw new Exception("component name '" + componentName + "' does not exist");
};

World.prototype._getComponentIdFromInstance = function(component) {
    return this._getComponentIdFromName(component.constructor.componentName());
}

World.prototype._getComponentIdFromName = function(componentName) {
    if (!_.has(this._componentTypeRegistry, componentName))
    {
        var id = this._componentTypeIdStream();
        this._componentTypeRegistry[componentName] = id;
        this._componentTypeBitRegistry[componentName] = Math.pow(2, id);
        this._components[id] = [];
    }
    return this._componentTypeRegistry[componentName];
}

World.prototype._getComponentBitIdFromName = function(componentName) {
    this._getComponentIdFromName(componentName);
    return this._componentTypeBitRegistry[componentName];
}

module.exports = World;
