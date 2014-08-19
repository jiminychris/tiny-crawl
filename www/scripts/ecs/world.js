var _ = require("underscore");
var Exception = require("../exception");

function World() {
    this._entityCount = 0;
    this._componentTypeCount = 0;
    this._systemCount = 0;
    this._rendererCount = 0;

    this._killedEntityStack = [];
    this._activeEntities = [];
    this._entityAspectBits = [];
    this._entityNameRegistry = {entityToName: {}, nameToEntity: {}};

    this._components = [];
    this._componentTypeRegistry = {};
    this._componentTypeBitRegistry = {};

    this._systems = [];
    this._systemRegistry = {};
    this._systemAspects = [];
    this._systemAspectBits = [];

    this._renderers = [];
    this._rendererRegistry = {};
    this._renderableAspects = [];
    this._renderableAspectBits = [];
    this._viewportAspects = [];
    this._viewportAspectBits = [];

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
    this._rendererIdStream = function() {
        var id;
        id = this._rendererCount;
        this._rendererCount += 1;
        return id;
    };
}

World.prototype.createEntity = function() {
    var entity = this._entityIdStream();
    this._entityAspectBits[entity] = 0;
    this._activeEntities.push(entity);
    if (arguments.length === 1)
        this.registerEntityName(entity, arguments[0]);
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
    this.unregisterEntityName(entity);
};

World.prototype.addComponent = function(entity, component) {
    this._validateEntity(entity);
    this._components[this._getComponentIdFromInstance(component)][entity] = component;
    this._entityAspectBits[entity] |= this._getComponentBitIdFromName(component.constructor.componentName());
    this._updateAllAspects(entity);
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

World.prototype.fetchEntityByName = function(name) {
    var entity = this._entityNameRegistry.nameToEntity[name];
    if (entity === undefined)
        return null;
    return entity;
}

World.prototype.removeComponent = function(entity, componentConstructor) {
    this._validateEntity(entity);
    var componentName = componentConstructor.componentName();
    this._validateComponentName(componentName);
    this._components[this._getComponentIdFromName(componentName)][entity] = null;
    this._entityAspectBits[entity] &= ~this._getComponentBitIdFromName(componentName);
    this._updateAllAspects(entity);
};

World.prototype.addSystem = function(system) {
    var name = system.systemName();
    if (_.has(this._systemRegistry, name))
        throw new Exception("system '" + name + "' has already been added");
    var systemId = this._systemIdStream();
    this._systemRegistry[name] = systemId;
    this._systems[systemId] = system;
    var systemAspectBits = _.reduce(
        _.map(system.aspect(), function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            return this._getComponentBitIdFromName(componentName);
        }, this),
        function(memo, num) {
            return memo | num;
        },
        0);
    this._systemAspectBits[systemId] = systemAspectBits;
    this._systemAspects[systemId] = {};
    _.each(this._activeEntities, function(entity, i) {
        this._updateSystemAspect(system, entity);
    }, this);
};

World.prototype.tick = function(dt) {
    _.each(this._systems, function(system, i) {
        system.tick(this, this._systemAspects[i], dt);
    }, this);
};

World.prototype.addRenderer = function(renderer) {
    var name = renderer.rendererName();
    if (_.has(this._rendererRegistry, name))
        throw new Exception("renderer '" + name + "' has already been added");
    var rendererId = this._rendererIdStream();
    this._rendererRegistry[name] = rendererId;
    this._renderers[rendererId] = renderer;
    var renderableAspectBits = _.reduce(
        _.map(renderer.renderableAspect(), function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            return this._getComponentBitIdFromName(componentName);
        }, this),
        function(memo, num) {
            return memo | num;
        },
        0);
    this._renderableAspectBits[rendererId] = renderableAspectBits;
    this._renderableAspects[rendererId] = [];
    var viewportAspectBits = _.reduce(
        _.map(renderer.viewportAspect(), function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            return this._getComponentBitIdFromName(componentName);
        }, this),
        function(memo, num) {
            return memo | num;
        },
        0);
    this._viewportAspectBits[rendererId] = viewportAspectBits;
    this._viewportAspects[rendererId] = [];
    _.each(this._activeEntities, function(entity, i) {
        this._updateRenderableAspect(renderer, entity);
        this._updateViewportAspect(renderer, entity);
    }, this);
};

World.prototype.render = function() {
    _.each(this._renderers, function(renderer, i) {
        renderer.render(_.values(this._viewportAspects[i]), _.values(this._renderableAspects[i]));
    }, this);
};

World.prototype.registerEntityName = function(entity, name) {
    this._entityNameRegistry.nameToEntity[name] = entity;
    this._entityNameRegistry.entityToName[entity] = name;
};

World.prototype.unregisterEntityName = function(entity) {
    var name = this._entityNameRegistry.entityToName[entity];
    delete this._entityNameRegistry.nameToEntity[name];
    delete this._entityNameRegistry.entityToName[entity];
};

World.prototype._updateAllAspects = function(entity) {
    _.each(this._systems, function(system) {
        this._updateSystemAspect(system, entity);
    }, this);
    _.each(this._renderers, function(renderer) {
        this._updateViewportAspect(renderer, entity);
        this._updateRenderableAspect(renderer, entity);
    }, this);
};

World.prototype._updateSystemAspect = function(system, entity) {
    var systemName = system.systemName();
    var systemId = this._systemRegistry[systemName];
    var systemAspectBits = this._systemAspectBits[systemId];
    delete this._systemAspects[systemId][entity];
    if ((systemAspectBits & this._entityAspectBits[entity]) === systemAspectBits)
    {
        var obj = {};
        _.each(system.aspect(), function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            obj[componentName] = this._components[this._getComponentIdFromName(componentName)][entity];
        }, this);
        var aspect = function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            return obj[componentName];
        };
        this._systemAspects[systemId][entity] = aspect;
    }
};

World.prototype._updateRenderableAspect = function(renderer, entity) {
    var rendererName = renderer.rendererName();
    var rendererId = this._rendererRegistry[rendererName];
    var renderableAspectBits = this._renderableAspectBits[rendererId];
    delete this._renderableAspects[rendererId][entity];
    if ((renderableAspectBits & this._entityAspectBits[entity]) === renderableAspectBits)
    {
        var obj = {};
        _.each(renderer.renderableAspect(), function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            obj[componentName] = this._components[this._getComponentIdFromName(componentName)][entity];
        }, this);
        var aspect = function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            return obj[componentName];
        };
        this._renderableAspects[rendererId][entity] = aspect;
    }
};

World.prototype._updateViewportAspect = function(renderer, entity) {
    var rendererName = renderer.rendererName();
    var rendererId = this._rendererRegistry[rendererName];
    var viewportAspectBits = this._viewportAspectBits[rendererId];
    delete this._viewportAspects[rendererId][entity];
    if ((viewportAspectBits & this._entityAspectBits[entity]) === viewportAspectBits)
    {
        var obj = {};
        _.each(renderer.viewportAspect(), function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            obj[componentName] = this._components[this._getComponentIdFromName(componentName)][entity];
        }, this);
        var aspect = function(componentConstructor) {
            var componentName = componentConstructor.componentName();
            return obj[componentName];
        };
        this._viewportAspects[rendererId][entity] = aspect;
    }
};

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
