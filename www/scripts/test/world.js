var assert = require("assert");
var World = require("../ecs/world");
describe('World', function() {
    describe('#createEntity()', function() {
        it('should return 0 and then 1', function() {
            var world = new World();
            assert.equal(0, world.createEntity());
            assert.equal(1, world.createEntity());
        });
        it('should fill deleted spaces', function() {
            var world = new World();
            assert.equal(0, world.createEntity());
            assert.equal(1, world.createEntity());
            assert.equal(2, world.createEntity());
            world.killEntity(1);
            assert.equal(1, world.createEntity());
            assert.equal(3, world.createEntity());
        });
    });
});