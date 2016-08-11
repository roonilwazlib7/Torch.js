function SpriteTests()
{
    this.fakeGame = {
        Add: function(o)
        {
            o._torch_uid = "001";
        }
    }
}
SpriteTests.prototype.Constructor_Called_ReturnsObject = function(assert)
{
    var that = this;
    var sprite = new Torch.Sprite(that.fakeGame, 0, 0);

    assert.notEqual(sprite, null)
}
SpriteTests.prototype.Constructor_CalledWithNullGame_ThrowsError = function(assert)
{
    var that = this;
    var sprite;

    assert.throws(function(){
        sprite = new Torch.Sprite(null, 0, 0);
    }, Error);
}
SpriteTests.prototype.Constructor_CalledInvalidX_ThrowsError = function(assert)
{
    var that = this;
    var sprite;

    assert.throws(function(){
        sprite = new Torch.Sprite(that.fakeGame, null, 0);
    }, Error);
}
SpriteTests.prototype.Constructor_CalledInvalidY_ThrowsError = function(assert)
{
    var that = this;
    var sprite;

    assert.throws(function(){
        sprite = new Torch.Sprite(that.fakeGame, 0, null);
    }, Error);
}

QUnit.test("Sprite Tests", function( assert )
{
    //assert.equal(1, 1);
    RunTests(SpriteTests, assert);
});
