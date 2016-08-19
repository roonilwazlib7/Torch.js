Torch.SpriteGroup = function(sprites, game)
{
    var that = this;
    this.sprites = sprites;
    this.game = game;
    for (var i = 0; i < that.sprites.length; i++)
    {
        that.sprites[i].anchorX = that.sprites[i].Rectangle.x;
    }
    return that;
};
Torch.SpriteGroup.prototype.Factory = function(spriteClass)
{
    this.spriteFactory = spriteClass;
    return this;
}
Torch.SpriteGroup.prototype.Add = function(sprites, x, y)
{
    var that = this;
    if (sprites == null && that.spriteFactory != undefined)
    {
        var newSprite = new that.spriteFactory(that.game, x, y);
        that.sprites.push(newSprite);
        return newSprite;
    }
    else
    {
        that.sprites = that.sprites.concat(sprites);
    }
    return that;
}
Torch.SpriteGroup.prototype.Trash = function()
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        that.sprites[i].Trash();
    }
    return that;
};
Torch.SpriteGroup.prototype.Shift = function(transition)
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        if (transition.x) sprite.Rectangle.x = sprite.anchorX + transition.x;
        //if (transition.y) sprite.Rectangle.y = sprite.Rectangle.y + transition.y;
    }
    return that;
};
Torch.SpriteGroup.prototype.Hide = function()
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        sprite.draw = false;
    }
    return that;
};
Torch.SpriteGroup.prototype.Show = function()
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        sprite.draw = true;
    }
    return that;
}
Torch.SpriteGroup.prototype.Center = function()
{
    var that = this;
    that.All(function(sprite){
        sprite.Center();
    });
    return that;
}
Torch.SpriteGroup.prototype.ToggleFixed = function()
{
    var that = this;
    that.All(function(sprite){
        sprite.ToggleFixed();
    });
    return that;
}
Torch.SpriteGroup.prototype.All = function(handle)
{
    var that = this
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        handle(sprite);
    }
    return that;
}
