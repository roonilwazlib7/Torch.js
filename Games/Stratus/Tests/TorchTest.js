function SpriteTests(assert)
{
    var fakeGame = {
        Add: function(o)
        {
            o._torch_uid = "001";
        }
    }
    var sprite = new Torch.Sprite(fakeGame, 0, 0);

    //some methods for testing
    var testTogglingFixed = function(sprite)
    {
        var firstFixed = sprite.fixed;
        sprite.ToggleFixed();
        assert.notEqual(firstFixed, sprite.fixed);
    }
    var test

    //begin the testing
    assert.notEqual(sprite.game, undefined);
    assert.notEqual(sprite.Rectangle, undefined);
    assert.notEqual(sprite.Body, undefined);
    assert.notEqual(sprite.HitBox, undefined);
    testTogglingFixed(sprite);
}






QUnit.test("Sprite Tests", function( assert )
{
    //assert.equal(1, 1);
    SpriteTests(assert);
});
